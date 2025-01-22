const connection=require("../db/connectionDb");
//mannaggia
//index
function index (req,res){
    const sql= 'SELECT * FROM doctors'
    connection.query(sql,(err, results)=>{
        if (err)return res.status(500).json ({
            error:'Database query failed'
            
        })
      
        res.json({
            status: "ok",
            results
        });
        console.log(res);
    })

};
//show
function show (req,res){
    const id = parseInt(req.params.id);
    const sqlDoctors ="SELECT * FROM `doctors` WHERE `id` = ? ";
    connection.query(sqlDoctors,[id],(err, doctorsResults)=>{
        if(err){
           console.log(err);
           return res.tatus(500).json({
           error: "Database query failed"})  ;     
        }
        if(doctorsResults.lenght === 0){
           return res.status(404).json({error: "doctor not found"});
        }
        const doctor = doctorsResults[0];

     
        const sqlReviews = `
            SELECT reviews.*
            FROM reviews
            INNER JOIN doctors
            ON doctors.id = reviews.doctor_id
            WHERE doctors.id = ?`;
        connection.query(sqlReviews, [id], (err, reviewResults) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: "Database query failed"
                });
            }
            const reviews= reviewResults

            const sqlSpecialty = `
            SELECT specialties.*
            FROM specialties
            INNER JOIN doctors
            ON doctors.specialty_id = specialties.id
            WHERE doctors.id = ?`;
            connection.query(sqlSpecialty, [id], (err, specialtyResults) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: "Database query failed"
                });
            }
            res.json({
                status: "ok",
                doctor: {
                    ...doctor,
                    ...reviews,
                    specialty:specialtyResults
                }
            });
            
            })

           

        });
        
        
        
       })
   
}
// res.json({
//     status: "ok",
//     doctor: {
//         ...doctor,
//         reviews:reviewResults
//     }
// });

//create
function create (req,res){

};
//modify
function modify (req,res){

};
//update
function update (req,res){

};
//destroy
function destroy (req,res){

};
module.exports ={index, show, create, modify, update, destroy};
