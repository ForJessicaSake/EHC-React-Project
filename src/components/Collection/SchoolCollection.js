import { useState, useEffect } from "react"
import { 
    addDoc, 
    collection, 
    query, 
    serverTimestamp, 
    onSnapshot, 
    orderBy 
} from "firebase/firestore"
import { db, auth } from "../../config/firebase"
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { HiPlusSm } from 'react-icons/hi'
// import { BsCollectionFill } from 'react-icons/bs'
// import { IoIosNotificationsOutline } from 'react-icons/io'
// import { BiSearch } from 'react-icons/bi'
// import { CgProfile } from 'react-icons/cg'
import Todo from "../Todo/Todo"
import './collection.scss'
import Navbar from "../Navbar/Navbar"
import SideNav from "../SideNav/SideNav"

function School() {

    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([])

    const user = auth.currentUser

    useEffect(() => {
        getSchoolCollection()
    }, [])

    const addTodo = async () => {
        if (user !== null) {
            const uid = user.uid
            await addDoc(collection(db, `school/${uid}/todoList`), {
                todo,
                time: serverTimestamp(),
                complete: false
            })
        }
        getSchoolCollection()
    };

    const getSchoolCollection = () => {
        if (user !== null ){
            const uid = user.uid
            const q = query(collection(db, `school/${uid}/todoList`), orderBy('time', 'desc'))
            const unsub = onSnapshot(q, (querySnapshot) => {
                let items = [];
                querySnapshot.forEach(doc => {
                    items.push({...doc.data()})
                })
                console.log(items)
                setTodos(items)
            })
            return () => unsub();
        } else {
            console.log('no user found')
        }
    }

    return (
        <main>
            <Navbar />
            <div className="todos-wrapper">
                <SideNav />
                <div className="todolist">
                    <div className='wrapper'>
                        <div className="heading">
                            <span>
                                <button className="back-arrow">
                                    <MdOutlineKeyboardArrowLeft />
                                </button>
                                School
                            </span>
                            <button>
                                ...
                            </button>
                        </div>
                        <div className="todo-form">
                            <button className='add-btn' onClick={addTodo}><HiPlusSm /></button>
                            <input 
                                type='text' 
                                className='input' 
                                placeholder="Add a task"
                                value={todo}
                                onChange={(e) => setTodo(e.target.value)}
                            />
                        </div>
                        <div className="tasks-container">
                            <p>Tasks - </p>
                            <div className="tasks-wrapper">
                                {todos.map((task) => {
                                    return (
                                        <Todo key={task.time} task={task} />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default School