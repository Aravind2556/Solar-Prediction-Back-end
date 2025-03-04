const express = require('express')
const Register = require('../model/Register')

const router = express.Router();


router.post('/Create-Account', async (req, res) => {
    try {
                let user = await Register.find({})
        let id;
        if (user.length > 0) {
            let last_product_array = user.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.Id + 1;
        } else {
            id = 1
        }

        let year = new Date().getFullYear();


let lastUser = await Register.findOne(
    { userid: new RegExp(`^D-${year}-\\d+$`) }, 
    { userid: 1 }, 
    { sort: { createdAt: -1 } } 
);

let newNumber = 1; 

if (lastUser && lastUser.userid) {
    let lastNumber = parseInt(lastUser.userid.split("-")[2], 10); 
    newNumber = lastNumber + 1;
}


let uniqueId = `D-${year}-${String(newNumber).padStart(3, '0')}`;



        const { name, email, contact, password, confirmPassword } = req.body;
        console.log(name, email, contact, password, confirmPassword);

        if (password !== confirmPassword) {
            return res.send({ success: false, message: "Passwords do not match." });
        }

        if (name && email && contact && password) {
            const existingUser = await Register.findOne({ Email: email });
            if (existingUser) {
                return res.send({ success: false, message: "A user with this email already exists. Please use a different email to register." });
            }

            const newUser = new Register({
                Id : id,
                userid : uniqueId, // Assign the generated ID
                Name: name,
                Email: email,
                Password: password,
                Contact: contact,
                Role: "User"
            });

            const savedUser = await newUser.save();
            if (savedUser) {
                req.session.profile = {
                    Id: newUser.Id,
                    Name: newUser.Name,
                    Email: newUser.Email,
                    Role: newUser.Role,
                };

                req.session.save((err)=>{
                    if(err){
                        return res.send({success: false, message: "Created user and Failed to create session!"})
                    }
        
                    return res.send({success: true, message: "User Registration successfully!", data: savedUser})
                })

            } else {
                return res.send({ success: false, message: "Registration failed. Please try again later." });
            }
        } else {
            return res.send({ success: false, message: "All fields are required. Please provide complete user information." });
        }
    } catch (err) {
        console.log("Error during user registration:", err);
        return res.send({ success: false, message: "An error occurred during registration. Please contact the developer." });
    }
});


router.post('/Login-User', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Register.findOne({ Email: email ,Role: 'User'});
        if (!user) {
            return res.send({ success: false, message: "Invalid user ID" });
        }

        if (user.Password !== password) {
            return res.send({ success: false, message: "Invalid password" });
        }

        const { Id, Name, Role, Contact, Email ,userid } = user;
        const currentUser = { Id, Name, Role, Contact, Email , userid };
        req.session.profile = currentUser;

        return res.send({ success: true, message: "Login successful", user: req.session.profile });
    } catch (err) {
        console.log("Error in login:", err);
        return res.send({ success: false, message: "Error logging in, please contact support" });
    }
});






router.get('/checkauth', async (req, res) => {
    try {
        const isValidSession = req.session.profile
        if (isValidSession) {
            const fetchUser = await Register.findOne({ Email: req.session.profile.Email })
            if (fetchUser) {
                return res.send({ success: true, user: isValidSession })
            }
            else {
                return res.send({ success: false, message: "No User Available " })
            }
        }
        else {
            return res.send({ success: false, message: "User not logged in" })
        }
    }
    catch (err) {
        console.log("Error in checking Authentication: ", err)
        return res.send({ success: false, message: "Troble in checking Authentication, Please contact developer!" })
    }
})



router.get('/logout', async (req, res) => {

    try {

        if (req.session.profile) {
            req.session.destroy((err) => {
                if (err) {
                    console.log("Error in destroying session:", err);
                    return res.send({ success: false, message: "Failed to log out! Please contact developer." });
                }
                return res.send({ success: true, message: "Logged out successfully!" });
            })
        }
        else {
            return res.send({ success: false, message: "Failed to Logout!" })
        }
    }
    catch (err) {
        console.log("Trouble in erro to logout", err)
        return res.send({ success: false, message: "Trouble in Logout! please contact support team" })
    }
})

router.get('/fetch-user',async (req,res)=>{
    try{

        const isRegister = await Register.find({})
        if(isRegister){

            return res.send({success : true , user : isRegister})

        }
        else{
            return res.send({success : false , message : "usre data is required"})
        }

    }
    catch(err){
        console.log("Trouble in fetching user:", err)
        return res.send({ success: false, message: "Trouble in fetching users contact admin" })
    }
})



module.exports = router