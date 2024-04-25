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


  constructor(private http: HttpClient) {
    this.getTodoList();
   }

  changeTodo(i:number){
    const item = this.todoList.splice(i, 1);
    this.http.put('http://localhost:5000/', {task: item[0].content, status: true}).subscribe(
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
    this.http.put('http://localhost:5000/', {task: item[0].content, status: false}).subscribe(
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
    console.log(this.todoList[i].content);
    if (confirm('Are you sure you want to delete this task?')){
    this.http.delete('http://localhost:5000/'+ this.todoList[i].content).subscribe(
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
    console.log(this.finishedList[i].content);
    if (confirm('Are you sure you want to delete this task?')){
    this.http.delete('http://localhost:5000/'+ this.finishedList[i].content).subscribe(
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
    if (this.todoValue.trim()) {
       const httpOptions = {
         headers: new HttpHeaders({
           'Content-Type': 'application/json'
         }),
         responseType: 'text' as 'json' // Corrected responseType
       };
       const taskData = { task: this.todoValue }; // Prepare the data as an object
       console.log(this.todoValue);
       this.todoList.push({content: this.todoValue, value: false});
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
      this.todoList = response.map((item:any) => ({
        content: item[1],
        value: item[2]
      }));
    },
    error: (error) => {
      console.error('Error fetching todo list:', error);
    }
  });
 }
}


