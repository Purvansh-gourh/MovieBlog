var mongoose = require("mongoose"),
    Movie = require("./models/movie");

var data = [
    {
        name: "Harry Potter",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRZ5U760xl1VtMw-Y-DAcvI5wiPsGdg9Kcc5QdzuDWzW0cIe3zq&usqp=CAU",
        review: "The start to the Harry Potter film series is filled with visual splendor," +
            "valiant heroes, spectacular special effects, and irresistible characters." +
            "It's only fair to say that it's truly magical. The settings manage to be sen" +
            "sationally imaginative and yet at the same time so clearly believable and lived-in that " +
            "you'll think you could find them yourself, if you could just get to Platform 9 3/4."
    },
    {
        name: "Avengers",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQk06QUyDYvBgKR5OSsinjq1V7J9zWjoc3exiH6FH1GmAYh6dGO&usqp=CAU",
        review: "The grave course of events set in motion by Thanos that wiped out half the universe and fractured the " +
            "Avengers ranks compels the remaining Avengers to take one final stand in Marvel Studios' grand " +
            "It's only fair to say that it's truly magical. The settings manage to be sen" +
            "conclusion to twenty-two films, 'Avengers: Endgame.' "
    },
    {
        name: "Lord of the Rings",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQk06QUyDYvBgKR5OSsinjq1V7J9zWjoc3exiH6FH1GmAYh6dGO&usqp=CAUhttps://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSbh0dVs91PJ7YHPip0HUAKm6EE0pLAQubN10VYxI7lC1-qsEYZ&usqp=CAU",
        review: "It is my firm belief that the standard versions of The Lord of the Rings should be jettisoned " +
            "in favour of the extended editions universally. Sure, the near 4 hour runtime is a tad steep, but for " +
            "an absolute masterpiece like this, it's work every second and the first act of undoubtedly the best trilogy " +
            "in cinematic history!"
    }
];
function seedDB() {
    Movie.deleteMany({}, function (err) {
        // if(err){
        //     console.log(err);
        // }else{
        //     console.log("removed movies");
        //     data.forEach(function(seed){
        //         Movie.create(seed,function(err,data){
        //             if(!err){
        //             console.log("added");
        //             }
        //         });
        //     });
        // }
    });
}
module.exports = seedDB;  