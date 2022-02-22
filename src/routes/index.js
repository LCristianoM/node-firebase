const { Router } = require('express');
const { db } = require("../firebase");

const router = Router();

router.get("/", async (req, res) => {
	const querySnapshot = await db.collection("contacts").get();

	const contacts = querySnapshot.docs.map((doc) => ({
		id: doc.id,
        ...doc.data() //trae todos los datos que hay en el documento en firebase

		// firstname: doc.data().firstname,
		// lastname: doc.data().lastname,
		// email: doc.data().email,
	}));

    console.log(contacts);
	res.render("index", { contacts });
});

//CRUD
//enviar data new contact
router.post('/new-contact', async(req, res) => {//creamos la ruta

	//traemos los datos queform nos devuelve
	const { firstname, lastname, email, phone } = req.body;

	//consulta para insertar en la base de datos
	await db.collection("contacts").add({
		firstname,
		lastname,
		email,
		phone,
	});
	//console.log(firstname, lastname, email, phone);

	res.redirect('/');//respuesta
});

//enviar data edit contact
router.get('/edit-contact/:id', async(req,res) => {

    const doc = await db.collection('contacts').doc(req.params.id).get()
    
    

    res.render('index', { contact: {id: doc.id, ...doc.data()} })
});

//enviar data delete contact
router.get('/delete-contact/:id', async(req, res) => {

    await db.collection('contacts').doc(req.params.id).delete()

    res.redirect('/');
});

//enviar data update contact
router.post('/update-contact/:id', async(req, res) => {

    const {id} = req.params;
    await db.collection('contacts').doc(id).update(req.body);

    res.redirect('/');
});

module.exports = router;