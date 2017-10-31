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

		sesi.model.where({tpi_id: body['id_tpi'], tanggal_sesi: tanggal}).fetch({withRelated: ['ikan']}).then(function (model) {
			if (!model) {
				response.json({
					msg: "Tidak ada sesi pada tanggal tersebut"
				})
				return;                
			}

	        hasil_nelayan.model.where({tpi_id: body['id_tpi'], tanggal: date}).count().then(function (jumlah_nelayan) {

				var total_harga = 0

				for(var i=0; i<model.length; i++) {
					total_harga += model.at(i).get('akhir_harga')
				}

				response.json({
					hasil_lelang: model,
					jumlah_nelayan: jumlah_nelayan,
					jumlah_sesi: model.length,
					total_harga: total_harga
				})
			})
		}).catch(function(err) {
			console.log('Fetching failed')
			console.log(err)
			response.status(500).send("Cannot validate peserta: " + err)
		})
	}
}
