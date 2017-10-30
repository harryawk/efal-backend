function randomString() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

module.exports = function(request, response) {
	var sesi = require('../../model/sesi')
	var penawaran = require('../../model/penawaran')
	var moment = require('moment')

	var body = request.body
	console.log(body)

	if (!body['api_key']) {
		response.status(403).json({
			msg: "No API Key"
		})
		return
	}


    new sesi.model({ id: body['id_sesi'] })
		.save({
			status: 3,
			jam_selesai: moment().format('YYYY-MM-DD HH:mm:ss')
		}, { patch: true }).then(function(sesi_model) {
			//iterasi semua penawaran, kasih kode kemenangan buat semua yg dapet 
			penawaran.model.where({sesi_id: body['id_sesi']}).orderBy('harga_tawaran').fetchAll().then(function (model) {
				var count = 0
				model.count().then(function (count_result) {
					count = count_result
				})
				sum_berat = 0
				for (var i=0; i<count; i++) {
					if (sum_berat < sesi_model.get('berat')) {
						berat_dapat = 0
						kode_kemenangan = randomString()
						if (sum_berat + model[i].get('berat_kebutuhan') > sesi_model.get('berat')) {
							berat_dapat = sesi_model.get('berat') - sum_berat
							sum_berat = sesi_model.get('berat')
						} else {
							sum_berat += model[i].get('berat_kebutuhan')

							berat_dapat = model[i].get('berat_kebutuhan')
						}

						new penawaran.model({id: model[i].get('berat_kebutuhan')}, {patch: true})
							.save({
								berat_dapat: berat_dapat,
								kode_kemenangan: kode_kemenangan
							})
							.then(function (model) {

							})
							.catch(function (error) {
								console.log(error)
							})
					}
				}
			})

			response.json({
				sukses: true,
				// daftar_penawar: 
			})
			return;
		}) // add catch - update hasil_nelayan


	// sesi.model.where({id: body['id_sesi']}).fetch().then(function(model) {
	// 	if (model) {
	// 		sesi.status = 2
	// 		sesi.jam_mulai = Date.now()
	// 		sesi.save().then(function (error) {
	// 			response.json({
	// 				sukses: true
	// 			})
	// 			return
	// 		}).catch(function (error) {
	// 			response.json({
	// 				sukses: false,
	// 				pesan: 'gagal save model'
	// 			})
	// 			return
	// 		})
	// 	} else {
	// 		response.json({
	// 			sukses: false,
	// 			pesan: 'sesi tidak ditemukan'
	// 		})
	// 		return			
	// 	}
	// }).catch(function (error) {
	// 	response.json({
	// 		sukses: false,
	// 		pesan: 'gagal retrieve sesi'
	// 	})
	// 	return		
	// })

	// tpiadmin.model.where({api_key: body['api_key']}).fetch().then(function(model) {
	// 	if (model) {
	// 		sesi.model.where({tpi_id: model.get('tpi_id'), tanggal_sesi: body['tanggal']}).fetchAll().then(function(sesi_model) {
	// 			response.json({
	// 				daftar_sesi: sesi_model
	// 			})
	// 			return
	// 		}).catch(function(error){
	// 			console.log('Fetching failed')
	// 			console.log(error)
	// 			response.status(500).send("Cannot fetch admin: " + error)
	// 		})
	// 	} else {
 //          response.json({
 //            msg: "Invalid Credentials"
 //          })
 //          return;
	// 	}
	// }).catch(function(error){
 //        console.log('Fetching failed')
 //        console.log(error)
 //        response.status(500).send("Cannot fetch admin: " + error)
	// })
}