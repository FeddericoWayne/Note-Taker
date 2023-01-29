// instantiates an express router
const notes = require('express').Router();
// imports node's file system 
const fs = require('fs');

// handles note GET requests and sends all the existing notes to be rendered on front-end
notes.get('/',(req,res)=>{
    
    // read from the current notes database
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if(err) {
            console.error(err)
        }
        // parses the retrieved data and assigns it to the notes variable
        const notes = JSON.parse(data);

        // sends back updated existing notes
        res.status(200).json(notes)
    })

});

// handles note POST requests
notes.post('/',(req,res)=>{

    // reads from db, pushes new note into array, and save to note database again
    fs.readFile("./db/db.json","utf-8",(err,data)=> {

        if (err) {
            console.log(err)
        }
        
        // parses the saved notes and adds the new note to the saved notes
        const currentDb = JSON.parse(data);
        const reqNote = req.body;
        currentDb.push(reqNote);

        // stringifies the updated notes for saving
        const updatedDb = JSON.stringify(currentDb);

        // adds date and time to POST request
        const date = new Date();
        // writes updated notes into db.json
        fs.writeFile("./db/db.json",updatedDb,()=>{console.log(`New Note Saved: ${date}`)})


    
    })

    // adds date and time to POST request response
    const date = new Date();
    // sends a "success" message back
    res.status(200).json(`New Note POST request successful: ${date}` );
});

// handles note DELETE requests
notes.delete('/:id',(req,res)=>{

    fs.readFile("./db/db.json","utf-8",(err,data)=>{

        if(err) {
            console.error(err)
        }

        const existingNotes = JSON.parse(data)

        for(let i=0; i<existingNotes.length; i++) {
            if(existingNotes[i].id === req.params.id.toString()) {
                existingNotes.splice(i,1);

                // writes the updated notes into db.json
                fs.writeFile("./db/db.json",JSON.stringify(existingNotes),()=>{

                    // adds date and time to DELETE request
                    const date = new Date();
                    // logs when note successfully deleted from database
                    console.log(`Note Deleted: ${date}`)
                 
                })

                // adds date and time to DELETE request response
                const date = new Date();
                // sends a "success" message back
                res.status(200).json(`DELETE request successful: ${date}`);

            }
        }
        
    })

})

// exports the module for notes GET, POST, and DELTE requests
module.exports = notes;
