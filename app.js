const express = require('express');
const mongoose = require('mongoose');
const app = express()
const rooter = express.Router()

const PORT = 5050



app.use(express.json())
 mongoose.connect('mongodb://127.0.0.1:27017/todo', 
 { useNewUrlParser: true, useUnifiedTopology: true }); 
 db = mongoose.connection; db.on('error', 
 console.error.bind(console, 'connection error:')); 
 db.once('open', function () { console.log("connecté à Mongoose") 
});


/*  Création des routes avec express */

const Schema = mongoose.Schema

const todoSchema = new Schema ({
    titre: {type: String, required: true} ,
    text : String,

});

const todo = mongoose.model('todo', todoSchema);


/* Mise en place des opérations crud */

const createTodo = async (req, res) => {
    try {  
        const nouveauTodo = await todo.create({titre: req.body.titre, text: req.body.text });
        console.log('Nouvelle tâche crée avec succés', nouveauTodo);
        res.status(201).json(nouveauTodo)
    } catch (error) {
        console.log(req.body);
        res.status(400).json(error)
    }
}

const deleteTodo = async (req, res) => {
    try {
        const suprimeTodo = await todo.deleteOne({_id: req.params.id});
        console.log("Votre tâche a bien été supprimé ", suprimeTodo);
        res.status(200).json(suprimeTodo)
    } catch(error) {
        console.log(req.body);
        return error
    }
}

const readTodo = async (req, res) => {
    try {
        const getTodoList = await todo.find();
        console.log('Voici votre tâche', getTodoList);
        res.status(200).json(getTodoList)

    } catch(error) {
        console.log(error)
        res.status(400).json(err)
    }
}

const updateTodo = async (req, res) => {
    try {
        const getTache = await todo.updateOne({"_id": req.params.id}, {titre: req.body.titre, text: req.body.text })
        console.log(getTache)
        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(400).json()
    }
}




/* autorisation des adresses d'origine de nos requêttes ainsi que des requettes autorisées */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next()
  });

/* Mise en place des requêttes http pour les routes*/
app.use(rooter.get('/', readTodo))
app.use(rooter.post('/create', createTodo))
app.use(rooter.delete('/delete/:id', deleteTodo))
app.use(rooter.put('/update/:id', updateTodo))


/* Écoute du port en question et ouverture du serveur */

app.listen(PORT, () => {
    console.log(`🚀écoute sur le port ${PORT}`)
})
