module.exports = function(request, response) {
	var sesi = require('../../model/sesi')
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
			status: 2,
			jam_mulai: moment().format('YYYY-MM-DD HH:mm:ss')
		}, { patch: true }).then(function(model) {
			response.json({
			sukses: true
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