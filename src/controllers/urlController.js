const { isValid } = require("shortid");
const shortId = require("shortid");
const validUrl = require("valid-url");
const urlModel = require("../models/urlModel");
const { SET_ASYNC, GET_ASYNC } = require("../caching-DB/caching");

const shortenURL = async function (req, res) {
	try {
		let data = req.body;
		data.longUrl = data.longUrl.trim();
		if (Object.keys(data).length === 0) {
			return res
				.status(400)
				.send({ status: false, message: "Please provide longUrl" });
		}
		if (!validUrl.isWebUri(data.longUrl)) {
			return res.status(400).send({ status: false, message: "Invalid URL" });
		}
		const isLongURLPresent = await urlModel
			.findOne({ longUrl: data.longUrl })
			.select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });
		if (isLongURLPresent) {
			return res
				.status(201)
				.send({ status: true, data: isLongURLPresent.shortUrl });
		}

		let urlcode = shortId.generate(data.longUrl);
		let shortedUrl = `http://localhost:3001/${urlcode}`;
		data.urlCode = urlcode;
		data.shortUrl = shortedUrl;

		let newURL = await urlModel.create(data);
		let { longUrl, shortUrl, urlCode } = newURL.toObject();

		res.status(201).send({ status: true, data: shortUrl });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const redirecturl = async function (req, res) {
  try {
    let urlCode = req.params.urlCode
    if (!urlCode) {
      return res.status(400).send({ status: false, message: "plese provide short url" })
    }
    if (!shortId.isValid(urlCode)) {
      return res.status(400).send({ status: false, message: "invalid urlCode" })
    }
    let cachedmainUrl = await GET_ASYNC(`${urlCode}`)
    if (cachedmainUrl) {
      return res.status(302).redirect(cachedmainUrl)
    } else {
      let mainUrl = await urlModel.findOne({ urlCode: urlCode }, { longUrl: 1, _id: 0 })
      if (!mainUrl) {
        return res.status(404).send({ status: false, message: "url not found" })
      }
      await SET_ASYNC(`${urlCode}`, mainUrl.longUrl)
      return res.status(302).redirect(mainUrl.longUrl)
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}

module.exports = { shortenURL, redirecturl };
