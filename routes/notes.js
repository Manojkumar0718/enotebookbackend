import express from 'express'
import Notes from './../models/Notes.js'
import fetchUser from '../middleWare/fetchUser.js';
const router = express.Router()

//Fetch all notes route
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.userId })
        res.json(notes);

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

//add note route
router.post('/addnote', fetchUser, async (req, res) => {
    try {

        //data coming from frontend
        const { title, description, tag } = req.body

        //Validation
        if (!title || !description || !tag) {
            return res.status(400).json({ error: "All fields required" });
        }

        const notes = new Notes({
            title,
            description,
            tag,
            user: req.userId
        });

        //Save notes
        const savedNote = await notes.save();
        res.json({ savedNote , success : "Note added successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

//Update notes route
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    const { id } = req.params

    try {

        //Find the note that needs to be updated
        const note = await Notes.findById({ _id: id })

        if (!note) {
            return res.status(400).send("Not found")
        }

        if (note.user.toString() !== req.userId) {
            return res.status(401).send("Not Allowed");
        }

        console.log(note)

        //Update the notes
        const notes = await Notes.findByIdAndUpdate({ _id: id }, {
            $set: {
                title,
                description,
                tag
            }
        }, { new: true })

        res.json({ notes, success: "Notes Updated Successfully" })




    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }
})

//Delete notes route
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        //* Find the note to be delete and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //* Allow deletion only if user owns this Note
        if (note.user.toString() !== req.userId) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


//Get notes route
router.get('/notes/:id', fetchUser, async (req, res) => {
    try {
        const { id } = req.params

        const note = await Notes.findById({ _id: id })
        console.log(note)

        if (note) {
            return res.status(200).json(note)
        } else {
            return res.status(400).json({ Success: "Notes not found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }
})

export default router