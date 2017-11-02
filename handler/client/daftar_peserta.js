// Hashing helper
function sha256(input, secret) {
  var crypto = require('crypto')
  const hash = crypto.createHmac('sha256', secret)
    .update(input)
    .digest('hex');

  return hash;
}

module.exports = function (request, response) {
	var peserta = require('../../model/peserta')

	var body = request.body
	console.log(body)

	peserta.model.where({nama_akun: body['nama_akun']}).fetch().then(function (model) {
		if (!model) {
			new peserta.model({
				nik: body['nik'],
				nama_lengkap: body['nama_lengkap'],
				nama_akun: body['nama_akun'],
				nomor_telepon: body['nomor_telepon'],
				email: body['email'],
				password: sha256(body['password'], '12345'),
				api_key: sha256(body['nama_akun'] + '_nelayan_' + body['nik'], 'efal-backend')
			}).save().then(function (model) {
		        if (model) {
		        	response.json({
				        sukses: true,
								api_key: model.get('api_key'),
								id_peserta: model.get('id'),
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
		} else {
			response.json({
				sukses: false,
				pesan: "Nama akun sudah ada"
			})			
		}
	})
}