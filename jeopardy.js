// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
let catIdArr = []
$("#spin-container").hide()


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const resCat = await axios.get("http://jservice.io/api/categories?count=100")
    
    const catData = resCat.data
    
    catIdArr=[];
   
    while(catIdArr.length<=5){
        const rand = Math.floor(Math.random()*101)
        for(const[i,v]of catData.entries()){
            
            if(i === rand){
                catIdArr.push(catData[i].id)
    
            }
        }
        
    }
    return catIdArr
}





    
    
   

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const resCatIdArr =[]
    categories=[];
    
    for(let id of catId){
        const resCatId = await axios.get(`http://jservice.io/api/category?id=${id}`)
        resCatIdArr.push(resCatId)
        }
    for (let res in resCatIdArr){
        const clueArr =[]
        let cluesArr = resCatIdArr[res].data.clues
        for(let clue in cluesArr){
          
            let answer = cluesArr[clue].answer
            let question = cluesArr[clue].question
            let obj = {question : `${question}` , answer : `${answer}` , showing : null}
            clueArr.push(obj)
            
        }
       
        let catObj = {title : `${resCatIdArr[res].data.title}`}
        catObj.clues = clueArr
        categories.push(catObj)
    }
    return categories
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */



async function fillTable() {
//    catIdArr=[];
    const gettingCatId = await getCategoryIds()
    
    const categoriesCluesArr = await getCategory(gettingCatId)
    // const jeopardyTable = document.getElementById("jeopardy")
    const thead = document.querySelector("thead")
    const tbody = document.querySelector("tbody")
    const top = document.createElement("tr")
    top.setAttribute("id", "top-of-column")
    for(let cat in categoriesCluesArr){
        console.log(categoriesCluesArr[cat])
        const createTopCell = document.createElement("td")
        createTopCell.innerText = categoriesCluesArr[cat].title
        top.append(createTopCell)
        thead.append(top)
        

    }
    
   
    for(let y =0 ; y<5; y ++){
        const row = document.createElement("tr")
        for (let x=0; x<6; x++){
            const clue = document.createElement("td")
            clue.setAttribute("id", `${y}-${x}`)
            clue.innerText="?"
            row.append(clue)
            tbody.append(row)
        }  
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

async function handleClick(evt) {
    let tar = evt.target
    let id = tar.getAttribute("id")
    let [clueId,catId] = id.split("-")
    // console.log(categories)
    let clickedClue = categories[catId].clues[clueId]
    if(clickedClue.showing === null){
        clickedClue.showing = "question"
        tar.innerText = clickedClue.question
        

    }else if(clickedClue.showing==="question"){
        clickedClue.showing = "answer"
        tar.innerText = clickedClue.answer
    }else{
        return
    }
    
}





/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

  function showLoadingView() {
    $("#jeopardy thead").empty()
    $("#jeopardy tbody").empty()
    $("#spin-container").show()
   $("#start").text("reload")
}

/** Remove the loading spinner and update the button used to fetch data. */

 function hideLoadingView() {
    $("#spin-container").hide()
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
        showLoadingView();
        await fillTable();
        hideLoadingView()
        // categories=[];
    
    

    
    
   
        
        
}



 async function clicked(){
    const tbody = document.querySelector("tbody")
    tbody.addEventListener("click", handleClick)
}
/** On click of start / restart button, set up game. */

// TODO
$("#start").on("click", setupAndStart)
$("#start").on("click", clicked)

/** On page load, add event handler for clicking clues */

// TODO

