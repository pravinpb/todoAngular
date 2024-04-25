import { Component } from '@angular/core';
import {Todo} from '../class/todo'
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})

export class TodoComponent {
  todoValue:string = '';
  warningMessage:string = '';
  todoList:Todo[] = [];
  finishedList:Todo[] = [];
  

  editTask: boolean = false;

  todoItem: Todo[] = []

  editingTask: Todo | null = null;
  editingTaskIndex: number | null = null;


  constructor(private http: HttpClient) {
    this.getTodoList();
   }

  changeTodo(i:number){
    const item = this.todoList.splice(i, 1);
    console.log(item[0]);
    this.http.put('http://localhost:5000/', {id: item[0].id, task:item[0].content,status: true}).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error('Error updating todo:', error);
      }
    );
    console.log(item);
    this.finishedList.push(item[0]);

  }
  changeFinished(i:number){
    const item = this.finishedList.splice(i, 1);
    console.log(item[0]);
    this.http.put('http://localhost:5000/', {id: item[0].id,task:item[0].content, status: false}).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error('Error updating todo:', error);
      }
    );
    console.log(item);
    this.todoList.push(item[0]);
  }

  deleteTodo(i:number){
    console.log(this.todoList[i]);
    if (confirm('Are you sure you want to delete this task?')){
    this.http.delete('http://localhost:5000/'+ this.todoList[i].id).subscribe(
      response => {
        console.log(response);
        this.todoList = this.todoList.filter((value, index) => index !== i);
      },
      error => {
        console.error('Error deleting todo:', error);
      }
    );
  }
  }

  deleteFinished(i:number){
    console.log(this.finishedList[i]);
    if (confirm('Are you sure you want to delete this task?')){
    this.http.delete('http://localhost:5000/'+ this.finishedList[i].id).subscribe(
      response => {
        console.log(response);
        this.finishedList = this.finishedList.filter((value, index) => index !== i);
      },
      error => {
        console.error('Error deleting todo:', error);
      }
    );
  }
  }

  addTodo() {
    console.log(this.editTask);
    if (this.todoValue.trim()) {
       const httpOptions = {
         headers: new HttpHeaders({
           'Content-Type': 'application/json'
         }),
         responseType: 'text' as 'json' // Corrected responseType
       };
       const taskData = { task: this.todoValue }; // Prepare the data as an object
       console.log(this.todoValue);
       this.todoList.push({content: this.todoValue, status: false});
       this.http.post('http://localhost:5000/', taskData, httpOptions).subscribe(
         response => {
           console.log(response);
         },
         error => {
           console.error('Error adding todo:', error);
         }
       );
       this.todoValue = '';
       this.warningMessage = ''; 
    } else {
       this.warningMessage = 'Please fill in the task.'; 
    }
   }
   

   getTodoList() {
    this.http.get('http://localhost:5000/').subscribe({
       next: (response: any) => {
         console.log(response);
   
         response.forEach((item: any) => {
           const todoItem = {
             id: item[0],
             content: item[1],
             status: item[2]
           };
           console.log("hello", todoItem); 

           if (todoItem.status === true) {
             this.finishedList.push(todoItem); 
           } else {
             this.todoList.push(todoItem);
           }
         });
       },
       error: (error: Error) => {
         console.error('Error fetching todo list:', error);
       }
    });
   }
   

 onEdit(index: number) {
  console.log('Editing task:', this.todoList[index]);
  this.todoValue = this.todoList[index].content;
  this.editingTask = this.todoList[index];
  this.editingTaskIndex = index;

}

 startEditing(index: number) {
  this.editingTaskIndex = index;
}

// Method to save the edited task
saveEdit(index: number) {
  if (this.editingTaskIndex === index) {
    this.http.put('http://localhost:5000/', {id: this.todoList[index].id, task: this.todoList[index].content, status:false}).subscribe(
      response => {
        console.log(this.todoList[index].id,this.todoValue);
      },
      error => {
        console.log("ERROR")
        console.error('Error updating todo:', error);
      }
    );
    this.editingTaskIndex = null; 
  }
}

// Method to cancel editing
cancelEdit() {
  this.editingTaskIndex = null;
}
}


