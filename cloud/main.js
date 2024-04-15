Parse.Cloud.define("retrieveTwo", async () => {
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async function retrieve(image_id) {
    let url;
    let elo;
    try {
      const query = new Parse.Query("Images");
      query.skip(image_id);
      await query.first().then(function (image) {
        if (image) {
          url = image.get("url");
          elo = image.get("elo");
        } else {
          console.log("Nothing found, please try again");
        }
      });
    } catch (error) {
      console.log(`Error: ${error}`);
    }
    return [url, elo];
  }

  async function retrieveTwo() {
    const query = new Parse.Query("Images");
    let count = await query.count();

    const image_id_1 = randomIntFromInterval(0, count - 1);
    let image_id_2 = image_id_1;

    while (image_id_2 == image_id_1) {
      image_id_2 = randomIntFromInterval(0, count - 1);
    }

    let [Image1url, Image1elo] = await retrieve(image_id_1);

    let [Image2url, Image2elo] = await retrieve(image_id_2);
    return {
      url1: Image1url,
      elo1: Image1elo,
      url2: Image2url,
      elo2: Image2elo,
    };
  }

  return await retrieveTwo();
});

Parse.Cloud.define("retrieveScore", async (request) => {
  async function retrieveAll() {
    let algorithms = [];
    try {
      const query = new Parse.Query("Images");
      await query.each(async function (image) {
        console.log(image);
        if (image) {
          await retrieveScore(image.get("url")).then((score) => {
            algorithms.push(score);
          });
        } else {
          console.log("Nothing found, please try again");
        }
      });
    } catch (error) {
      console.log(`Error: ${error}`);
    }
    console.log(algorithms);
    return algorithms;
  }

  async function retrieveScore(image_url) {
    let algorithm, elo, hfen, nmi, rmse, mad, cc1, cc2, gxe, nrmse, xsim, url;
    algorithm = image_url.split("/");
    console.log("image_url", image_url);
    try {
      const query = new Parse.Query("Images");
      query.equalTo("url", image_url);
      await query.first().then(function (image) {
        if (image) {
          elo = image.get("elo");
          hfen = image.get("HFEN");
          nmi = image.get("NMI");
          rmse = image.get("RMSE");
          mad = image.get("MAD");
          cc1 = image.get("CC1");
          cc2 = image.get("CC2");
          gxe = image.get("GXE");
          nrmse = image.get("NRMSE");
          xsim = image.get("XSIM");
          url = image.get("url");
        } else {
          console.log("Nothing found, please try again");
        }
      });
    } catch (error) {
      console.log(`Error: ${error}`);
    }
    return {
      algorithm: algorithm[algorithm.length - 1].split(".")[0],
      elo: (elo !== null) & (elo !== undefined) ? elo.toFixed(3) : elo,
      hfen: (hfen !== null) & (hfen !== undefined) ? hfen.toFixed(3) : hfen,
      nmi: (nmi !== null) & (nmi !== undefined) ? nmi.toFixed(3) : nmi,
      rmse: (rmse !== null) & (rmse !== undefined) ? rmse.toFixed(3) : rmse,
      mad: (mad !== null) & (mad !== undefined) ? mad.toFixed(3) : mad,
      cc1: (cc1 !== null) & (cc1 !== undefined) ? cc1.toFixed(3) : cc1,
      cc2: (cc2 !== null) & (cc2 !== undefined) ? cc2.toFixed(6) : cc2,
      gxe: (gxe !== null) & (gxe !== undefined) ? gxe.toFixed(3) : gxe,
      nrmse:
        (nrmse !== null) & (nrmse !== undefined) ? nrmse.toFixed(3) : nrmse,
      xsim: (xsim !== null) & (xsim !== undefined) ? xsim.toFixed(3) : xsim,
      url: url,
    };
  }

  return await retrieveAll(request.params.url);
});

Parse.Cloud.define("elo", async (request) => {
  async function updateElo(winnerUrl, winnerElo, looserUrl, looserElo) {
    console.log(winnerUrl, winnerElo, looserUrl, looserElo);
    if (winnerElo == null || winnerElo == undefined || winnerElo == "") {
      winnerElo = 0;
    }
    if (looserElo == null || looserElo == undefined || looserElo == "") {
      looserElo = 0;
    }
    let [winnerNewElo, looserNewElo] = calculateElo(
      parseFloat(winnerElo),
      parseFloat(looserElo)
    );
    setElo(winnerUrl, winnerNewElo.toString());
    setElo(looserUrl, looserNewElo.toString());
  }

  function calculateElo(winnerElo, looserElo) {
    let k = 32; // maximal ELO change per comparison
    let winnerExpected = 1 / (1 + Math.pow(10, (looserElo - winnerElo) / 400));
    let looserExpected = 1 / (1 + Math.pow(10, (winnerElo - looserElo) / 400));
    let winnerNewElo = winnerElo + k * (1 - winnerExpected);
    let looserNewElo = looserElo + k * (0 - looserExpected);
    console.log("calculated elo", winnerNewElo, looserNewElo);
    return [winnerNewElo, looserNewElo];
  }

  async function setElo(url, elo) {
    let query = new Parse.Query("Images");
    query.equalTo("url", url);

    try {
      query.first().then(function (image) {
        if (image) {
          image.set("elo", elo);
          image.save(null, {
            // https://github.com/mpc20001/SecureToDoCloudCodeRepo/blob/master/main.js
            useMasterKey: true, // required to update objects to database with restricted write access
          });
        } else {
          console.log("Nothing found, please try again");
        }
      });
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
  await updateElo(
    request.params.winner[0],
    request.params.winner[1],
    request.params.loser[0],
    request.params.loser[1]
  );

  return "ended";
});
