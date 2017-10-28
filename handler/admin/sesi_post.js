module.exports = function(require, response) {
	var sesi = require('../../model/sesi')
	var admin = require('../../model/admin')
	var hasil_ikan = require('../../model/hasil_ikan')

	body = request.body
	console.log(body)

	if (!body['api_key']) {
    	response.json({
	        sukses: false,
	        pesan: "API Key tidak ada"
	    })
	    return;
	}

	admin.where({api_key: body['api_key']}).fetch().then(function (model) {
		hasil_ikan.where({id: body['hasil_ikan_id']}).fetch().then(function (hasil_ikan_model) {
			new sesi.model({
				tpi_id: model.get('tpi_id')
				hasil_ikan_id: body['hasil_ikan_id'],
				ikan_id: hasil_ikan_model.get('ikan_id'),
				berat: hasil_ikan_model.get('berat'),
				jam_mulai: body['jam_mulai'],
				jam_selesai: body['jam_selesai'],
				mulai_harga: body['mulai_harga'],
				status: 1,

		        // "api_key": "blaskjakjdhasksajdasjksanj",
		        // "id_tpi": "askakcalmakcalkcm",
		        // "jenis_ikan": "kakap putih",
		        // "mulai_harga": 1000000,
		        // "jam_mulai": "2017-10-19T13:00:34.121Z",
		        // "jam_selesai": "2017-10-19T13:00:34.121Z"

			}).save().then(function (sesi_model) {
		        if (sesi_model) {
		        	response.json({
				        sukses: true,
				        api_key: model.get('api_key'),
				        pesan: "Berhasil"
				    })
				    return;
				} else {
					response.json({
						sukses: false,
						pesan: "Gagal menyimpan"
					})
				}
			}).catch(function (error) {
				console.log('Transaction failed')
				console.log(err)
				response.status(500).send("Error while saving: " + err)
			})


		}).catch(function (error) {
			console.log('Transaction failed')
			console.log(err)
			response.status(500).send("Error retrieve hasil ikan: " + err)
		})
	}).catch(function (error) {
		console.log('Transaction failed')
		console.log(err)
		response.status(500).send("Error while retrieve admin: " + err)
	})
}