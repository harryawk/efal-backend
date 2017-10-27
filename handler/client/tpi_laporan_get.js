module.exports = function (request, response) {
	var tpi = require('../../model/tpi')
	var sesi = require('../../model/sesi')

	var body = request.query
	console.log(body)

	if (!body['api_key']) {
		response.status(403).json({
			msg: "No API Key"
		})
	} else {
		var tanggal = moment(body['tanggal']).format('YYYY-MM-DD')

		tpi.model.where({id: body['id_tpi']}).fetch().then(function (model) {
			if (!model) {
				response.json({
					msg: "Tidak ada sesi pada tanggal tersebut"
				})
				return;                
			}

			// sesi.model.where({tpi_id: body['id_tpi']}.where('DATE(tanggal)', '=', tanggal).then(function (sesi_model) {
			// 	response.json({
			// 		daftar: tpi_list
			// 	})
			// }).catch(function(err) {
			// 	console.log('Fetching failed')
			// 	console.log(err)
			// 	response.status(500).send("Cannot retrieve TPI: " + err)                
			// })
		}).catch(function(err) {
			console.log('Fetching failed')
			console.log(err)
			response.status(500).send("Cannot validate peserta: " + err)
		})
	}
}