/**
 * Pass in a callback function to do something with the data if the fetch is successful.
 * The function should accept one parameter for the data.
 * 
 * The displayLots function handles the logic for displaying the lots on the home page if the data is successfully fetched.
 * @example getParkingJSON(displayLots);
 * @param {*} fn - The callback function which takes in data as a paramter and returns nothing.
 */
function getParkingJSON(fn) {
    fetch("https://eclipse-909.github.io/SD330//parking.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            fn(data);//invoke the callback function
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

/**
 * To be used as a callback function in getParkingJson.
 * Displays the parking information in the home page. Utilizes CSS by giving elements unique IDs.
 * @param {*} data - The data returned if the fetch was successful from getParkingJSON.
 */
function displayLots(data) {
    let htmlString = "";
    let index = 0;
    data.parkingLots.forEach(element => {
        htmlString +=
            "<div>" +
                "<h3>" + element.name + "</h3>" +
                "<img src=" + element.img + ">" +
                "<p>" + element.comments + "</p>" +
                "<p>Total Spaces: " + element.totalSpaces + "</p>" +
                "<p>" + (element.residential? "Residential Lot" : "Academic Lot") + "</p>" +
                "<a href='./parkingLot.html' class='listButton' onclick='localStorage.setItem(`lotIndex`, " + index + ")'>View Spots</a>" +
            "</div>";
        index++;
    });
    document.getElementById("lotsList").innerHTML = htmlString;
}

/**
 * To be used as a callback function in getParkingJson.
 * Displays the lot information of a given lot, and displays the parking spots.
 * The lot is specified by the number returned from localStorage.getItem('lotIndex'), which is used as an index for the lots array.
 * @param {*} data 
 */
function displaySpots(data) {
    //display lot info as header to page
    const lot = data.parkingLots[localStorage.getItem('lotIndex')];
    if (lot == undefined) {
        document.getElementById("lotHeader").innerHTML = "There was a problem loading the lot information. Please try again later.";
        return;
    } else {
        document.getElementById("lotHeader").innerHTML =
            "<h2>" + lot.name + "</h2>" +
            "<img src='" + lot.img + "'>" +
            "<p>" + lot.comments + "</p>" +
            "<p>Total Spaces: " + lot.totalSpaces + "</p>" +
            "<p>" + (lot.residential? "Residential Lot" : "Academic Lot") + "</p>";
    }

    //display lots as grid
    if (lot.totalSpaces === 0) {
        document.getElementById("lotHeader").innerHTML += lot.name + " doesn't have any parking spots at the moment.";
    } else {
        //Ideally the website would use your personal information to selectively display spots.
        //For example, students shouldn't be able to see faculty spots.
        let htmlString = "";
        let index = 0;
        lot.spaces.forEach(element => {
            htmlString += "<div class='spot'><h3>Spot " + (Number(index) + 1) + "</h3>";
            if (element.handicap) {
                htmlString += "<img src='https://www.safetysign.com/images/source/large-images/G2022.png'>";
            }
            htmlString +=
                "<p>" + ((element.faculty)? "Faculty" : "Student") + "</p>" +
                "<p>" + element.state + "</p>";
            switch(element.state) {
                case "Reserved":
                    htmlString += "<p>Time Reserved: " + new Date(element.reservedDateTime).toLocaleString() + "</p>";
                    break;
                case "Filled":
                    htmlString += "<p>Time Filled: " + new Date(element.filledDateTime).toLocaleString() + "</p>";
                    break;
                default:
                    break;
            }
            htmlString += "<a href='./parkingSpot.html' class='listButton' onclick='localStorage.setItem(`spotIndex`, " + index + ")'>View Spot</a></div>";
            index++;
        });
        document.getElementById("spotsList").innerHTML = htmlString;
    }
}

/**
 * To be used as a callback function in getParkingJson.
 * Displays the information of the spot again, and allows users to do certain actions with buttons.
 */
function displaySpot(data) {
    const lot = data.parkingLots[localStorage.getItem('lotIndex')];
    const index = localStorage.getItem('spotIndex');
    const spot = lot.spaces[index];
    if (spot == undefined) {
        document.getElementById("spot").innerHTML = "Something went wrong. Please try again later.";
    } else {
        let htmlString = "<div class='spot'><h3>Spot " + (Number(index) + 1) + "</h3>";
        if (spot.handicap) {
            htmlString += "<img src='https://www.safetysign.com/images/source/large-images/G2022.png'>";
        }
        htmlString +=
            "<p>" + ((spot.faculty)? "Faculty" : "Student") + "</p>" +
            "<p>" + spot.state + "</p>";
        switch(spot.state) {
            case "Reserved":
                htmlString += "<p>Time Reserved: " + new Date(spot.reservedDateTime).toLocaleString() + "</p>";
                break;
            case "Filled":
                htmlString += "<p>Time Filled: " + new Date(spot.filledDateTime).toLocaleString() + "</p>";
                break;
            case "Available":
                document.getElementById("actions").innerHTML = "<button class='listButton' onclick='alert(`Spot Reserved`)'>Reserve</button>";
                break;
            default:
                break;
        }
        document.getElementById("spot").innerHTML = htmlString;
    }
}
