import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  users=[]
  constructor(private http: HttpClient,private router:Router) { }

  ngOnInit() {
    this.http.get('http://localhost:4000/api').subscribe(
      (data: any[])=>{
        this.users=data;
        console.log(this.users)
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  editUser(id){
    this.router.navigate([`editUser/${id}`])
    
  }

  deleteUser(userId){
    this.http.delete(`http://localhost:4000/api/deleteUser/${userId}`).subscribe(
      (response: any[])=>{
        console.log(response)
        window.alert("User Deleted")
        window.location.reload();
      },
      (error)=>{
        console.log(error);
      }
    )    
  }

}
