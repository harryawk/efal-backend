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
	var peserta = require('../../model/peserta')

	var body = request.body
	console.log(body)

	if (!body['api_key']) {
		response.status(403).json({
			msg: "No API Key"
		})
		return
	}

	sesi.model.where({id: body['id_sesi']}).fetch().then(function (sesi_model) {
		//iterasi semua penawaran, kasih kode kemenangan buat semua yg dapet
		console.log('This is sesi_model')
		console.log(sesi_model)
		penawaran.model.where({sesi_id: body['id_sesi']})
		.orderBy('harga_tawaran', 'DESC').fetchAll()
		.then(function (model) {
			console.log('This is sesi_model')
			console.log(sesi_model.get('berat'))
			var count = model.length
			var sum_berat = 0
			var akhir_harga = 0
			for (var i=0; i<count; i++) {
				console.log(model.at(i))
				if (sum_berat < sesi_model.get('berat')) {
					console.log('masuk sini')
					var berat_dapat = 0
					var kode_kemenangan = randomString()
					if (sum_berat + model.at(i).get('berat_kebutuhan') > sesi_model.get('berat')) {
						berat_dapat = sesi_model.get('berat') - sum_berat
						sum_berat = sesi_model.get('berat')
					} else {
						sum_berat += model.at(i).get('berat_kebutuhan')
						berat_dapat = model.at(i).get('berat_kebutuhan')
					}
					akhir_harga += berat_dapat * model.at(i).get('harga_tawaran')

					new penawaran.model({id: model.at(i).get('id')}, {patch: true})
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

			new sesi.model({ id: body['id_sesi'] })
				.save({
					status: 3,
					jam_selesai: moment().format('YYYY-MM-DD HH:mm:ss'),
					akhir_harga: akhir_harga
				}, { patch: true })
				.then(function(sesi_model) {
				}) // add catch - update hasil_nelayan
				.catch(function (error) {
					console.log(error)
				})

			penawaran.model.where({sesi_id: body['id_sesi']})
				.where('kode_kemenangan', '<>', 'NULL')
				.fetchAll({withRelated: ['peserta']})
				.then(function(penawaran_model) {
					response.json({
						sukses: true,
						daftar_penawar: penawaran_model
					})
					return;
				})
				.catch(function (error) {
					console.log(error)
				})
		})
		.catch(function (error) {
			console.log(error)
		})
	})
}