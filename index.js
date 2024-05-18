let user;

const hideElementById = (id) => {
  const element = document.getElementById(id);
  element.classList.add('hidden');
  element.classList.remove('block');
}

const showElementById = (id) => {
  const element = document.getElementById(id);
  element.classList.remove('hidden');
  element.classList.add('block');
}

const setInnerTextById = (id, value) => {
  const element = document.getElementById(id);
  element.innerText = value;
}

const countLength = () => {
  const allData = fetchFromLS(user)
  const length = allData.length || 0;
  return length;
}

const refreshData = (newData) => {
  localStorage.removeItem(user);
  localStorage.setItem(user, JSON.stringify(newData))
  showIncompleteData();
  showCompletedData();
  showElementById('complete-todo-container')
}

const CheckComplete = async (id) => {
  const allData = await fetchFromLS(user);
  allData[id].isCompleted = true;
  refreshData(allData)
}

const handleSorting = (e) => {
  const sortBy = e.target.value;
  showIncompleteData(sortBy)
}

const handleLogin = (e) => {
  e.preventDefault()
  user = e.target.username.value;
  hideElementById('login');
  showElementById('incomplete-todo-container');
  showIncompleteData();
  showCompletedData();
  showElementById('complete-todo-container')
}

const handleAddBtnClick = () => {
  hideElementById('incomplete-todo-container');
  showElementById('addToDo');
  hideElementById('sortBy')
  hideElementById('complete-todo-container')
}

const handleAddToDo = (e) => {
  e.preventDefault()
  hideElementById('addToDo');
  showElementById('incomplete-todo-container')
  showElementById('complete-todo-container')
  const id = countLength();
  const title = e.target.title.value;
  const desc = e.target.desc.value;
  const date = e.target.date.value;
  const isCompleted = false;
  const data = { id, title, desc, date, isCompleted }
  saveToLS(data);
  showIncompleteData();
  e.target.title.value = '';
  e.target.desc.value = '';
  e.target.date.value = '';
}

const saveToLS = (data) => {
  const allData = fetchFromLS(user);
  allData.push(data)
  localStorage.setItem(user, JSON.stringify(allData))
}

const fetchFromLS = (user) => {
  const data = localStorage.getItem(user);
  if (data) {
    return JSON.parse(data)
  } else {
    return []
  }
}


const showIncompleteData = async (sortBy, newData) => {
  showElementById('add-btn')
  const allData = await fetchFromLS(user);
  const incompleteData = [...allData].filter((data) => {
    return data.isCompleted !== true;
  })
  setInnerTextById('incomplete-count', incompleteData.length)
  let displayData;
  if (!sortBy) {
    if (newData) {
      console.log(newData)
      displayData = newData
    } else {
      displayData = [...incompleteData]
    }
  } else {
    if (sortBy === 'asc') {
      displayData = [...incompleteData].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      })
    } else if (sortBy === "desc") {
      displayData = [...incompleteData].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      })
    }
  }


  const todoContainer = document.getElementById('todo')
  todoContainer.innerHTML = ''

  if (incompleteData.length === 0) {
    const notFoundElement = document.createElement('div');
    notFoundElement.innerHTML = `
      <p class="text-xl font-medium text-center">No Data Found.</p>
    `
    hideElementById('sortBy')
    todoContainer.appendChild(notFoundElement)
  } else {
    showElementById('sortBy')
  }

  const todoElement = displayData.map(data => {
    const todoElement = document.createElement('div')
    todoElement.innerHTML =
      `                    
    <div class="grid grid-cols-11 gap-6 border-2 p-6 rounded-lg bg-pink-50">
      <div class="col-span-10">
          <h1 class="text-2xl font-semibold pb-2">${data.title}</h1>
          <p class="pb-[2px]">Complete by - <span class="font-medium">${data.date}</span> </p>
          <p>${data.desc}</p>
      </div>
      <div class="col-span-1 items-end flex flex-col justify-center gap-4 text-2xl text-purple-800">
        <button onclick="CheckComplete(${data.id})" class="cursor-pointer"><i class="fa-solid fa-check-to-slot"></i></button>
        <button onclick="editData(${data.id})" class="cursor-pointer"><i class="fa-solid fa-pen-to-square"></i></button>
        <button  onclick="deleteFromLS(${data.id})" class="cursor-pointer"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
    `

    todoContainer.appendChild(todoElement)
  })
}

const showCompletedData = async () => {
  const allData = await fetchFromLS(user);
  const todoContainer = document.getElementById('todo-complete')
  todoContainer.innerHTML = ''

  const completedList = allData.filter(data => {
    return data.isCompleted === true;
  })
  setInnerTextById('complete-count', completedList.length)

  if (completedList.length === 0) {
    const notFoundElement = document.createElement('div');
    notFoundElement.innerHTML = `
      <p class="text-xl font-medium text-center">No Data Found.</p>
    `
    hideElementById('sortBy')
    todoContainer.appendChild(notFoundElement)
  } else {
    showElementById('sortBy')
  }

  const todoElement = completedList.map(data => {
    const todoElement = document.createElement('div')

    todoElement.innerHTML =
      `                   
    <div class="grid grid-cols-11 gap-6 border-2 p-6 rounded-lg bg-pink-50 w-full">
      <div class="col-span-10">
          <h1 class="text-2xl font-semibold pb-2">${data.title}</h1>
      </div>
      <div class="col-span-1 items-end flex flex-col justify-center gap-4 text-2xl text-purple-800">
        <button  onclick="deleteFromLS(${data.id})" class="cursor-pointer"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
    `

    todoContainer.appendChild(todoElement)
  })

}


const deleteFromLS = async (targetId) => {
  const allData = await fetchFromLS(user);
  const newData = [...allData].filter((data => {
    return data.id !== targetId
  }))
  refreshData(newData)
}

const editData = async (targetId) => {
  hideElementById('complete-todo-container')
  hideElementById('add-btn')
  showElementById('editToDo')
  hideElementById('sortBy')
  hideElementById('login')
  const allData = await fetchFromLS(user);
  hideElementById('incomplete-todo-container')
  const targetData = allData[targetId]
  const editDataContainer = document.getElementById('editToDo')
  editDataContainer.innerHTML = "";
  const editDataElement = document.createElement('div');
  editDataElement.innerHTML =
    `<form onsubmit="updateData(event,${targetId})" class="flex flex-col gap-2">
        <label for="title" class="font-medium">Title
        </label>
        <input id="title" value="${targetData?.title}" type="text" name="username" class="border-2 py-2 px-4 rounded-xl outline-none"
            placeholder="Enter Title">

        <label for="desc" class="font-medium mt-2">Description</label>
        <textarea name="desc" id="desc" class="border-2 py-2 px-4 rounded-xl outline-none resize-none"
            placeholder="Enter Description">${targetData?.desc}</textarea>

        <label for="date" class="font-medium mt-2">Deadline</label>
        <input value="${targetData?.date}" class="border-2 py-2 px-4 rounded-xl outline-none resize-none" type="date" name="date"
            id="date">

        <input type="submit" class="bg-purple-800 text-white py-2 px-4 rounded-lg font-semibold mt-2"
            value="Update">
    </form>`
  editDataContainer.appendChild(editDataElement)
}

const updateData = async (e, id) => {
  e.preventDefault();
  const allData = await fetchFromLS(user);

  const title = e.target.title.value;
  const desc = e.target.desc.value;
  const date = e.target.date.value;
  const data = { id, title, desc, date }
  allData[id] = data;
  refreshData(allData)
  hideElementById('editToDo');
  showElementById('incomplete-todo-container')
  showElementById('add-btn')
}

const handleSearch = (e) => {
  e.preventDefault();
  const keyword = e.target.keyword.value
  const allData = fetchFromLS(user);
  const targetData = allData.filter(data => {
    return data.title.includes(keyword)
  })
  const sort = false;
  showIncompleteData(sort, targetData)
  console.log(targetData)
}

const handleKeyUp = () => {
  const allData = fetchFromLS(user);
  const value = document.getElementById("searchValue").value;
  console.log(value)
  const targetData = fetchFromLS(user);
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };
  const todoContainer = document.getElementById("todo");
  todoContainer.innerHTML = ''; 

  targetData.forEach(data => {
    const highlightedTitle = highlightText(data.title, value);
    const resultItem = document.createElement("div");
    resultItem.classList.add("grid", "grid-cols-11", "gap-6", "border-2", "p-6", "rounded-lg", "bg-pink-50");
    resultItem.innerHTML = `
      <div class="col-span-10">
        <h1 class="text-2xl font-semibold pb-2">${highlightedTitle}</h1>
        <p class="pb-[2px]">Complete by - <span class="font-medium">${data.date}</span></p>
        <p>${data.desc}</p>
      </div>
      <div class="col-span-1 items-end flex flex-col justify-center gap-4 text-2xl text-purple-800">
        <button onclick="CheckComplete(${data.id})" class="cursor-pointer"><i class="fa-solid fa-check-to-slot"></i></button>
        <button onclick="editData(${data.id})" class="cursor-pointer"><i class="fa-solid fa-pen-to-square"></i></button>
        <button onclick="deleteFromLS(${data.id})" class="cursor-pointer"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    todoContainer.appendChild(resultItem);
  });
}

