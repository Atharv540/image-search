
var lastUrl, image_present;

const image_input = document.querySelector('#image_input');
const character_input = document.querySelector('#character_input');
const search_input = document.querySelector('#search_input');
lastUrl = '';
image_present = 0;

submitToDatabase = async () => {
    db.collection('images').add({
        imageUrl: image_input.value,
        character: character_input.value,
    })
    image_input.value = '';
    character_input.value = '';
}

displayImages = async () => {
    if(image_present>0){
        for(x=0; x<image_present; x++){
            let element_to_remove = document.getElementById('this_image');
            element_to_remove.remove();
        }
        image_present = 0;
    }
    db.collection('images').get().then(snapshot=>{
        snapshot.docs.forEach(doc=>{
            search_input.value = search_input.value.toLowerCase();
            if(doc.data().character.toLowerCase().includes(search_input.value) || search_input.value.includes(doc.data().character.toLowerCase()) || oneSameWord(search_input.value, doc.data().character.toLowerCase(), doc)===true){
                image_present++
                let img = document.createElement('img');
                img.setAttribute('src', doc.data().imageUrl);
                img.setAttribute('id', 'this_image');
                img.setAttribute('onclick', "window.open('"+doc.data().imageUrl+"')");
                img.style.borderRadius = '15px';
                img.style.marginLeft ='10px';
                img.style.height = '300px';
                img.style.marginTop = '50px';
                document.body.appendChild(img);
            }
        })
    })
}

oneSameWord = async (search_value, db_value, document) => {
    search_value_split = search_value.split(' ');
    db_value_split = db_value.split(' ');
    for(x=0; x<search_value_split.length; x++){
        for(y=0; y<db_value_split.length; y++){
            if((search_value_split[x] === db_value_split[x] || search_value_split[y] === db_value_split[y] || search_value_split[x] === db_value_split[y] || search_value_split[y] === db_value_split[x])){
                let value = await db.collection('images').doc(document.id).get()
                image_present++
                showImage(value);
            }
        }
    }
}

showImage = async (value) => {
    if(lastUrl !== value.data().imageUrl){
        let img = document.createElement('img');
        img.setAttribute('src', value.data().imageUrl);
        img.setAttribute('id', 'this_image');
        console.log('window.open("'+value.data().imageUrl+'")');
        img.setAttribute('onclick', "window.open('"+value.data().imageUrl+"')");
        img.style.borderRadius = '15px';
        img.style.marginLeft ='10px';
        img.style.height = '300px';
        img.style.marginTop = '50px';
        document.body.appendChild(img);
    }
    lastUrl = value.data().imageUrl
}


