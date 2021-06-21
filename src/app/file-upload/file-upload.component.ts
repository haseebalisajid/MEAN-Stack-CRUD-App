import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute,Route,Router} from '@angular/router';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {
  imageURL: string;
  form: FormGroup;
  users:any
  edit=false
  constructor(
    public fb: FormBuilder,
    private http: HttpClient,
    private route:ActivatedRoute,
    private router:Router
  ) {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      role: [''],
      avatar: [null]
    })
  }

  ngOnInit() { 
    this.route.params.subscribe((sub)=>{
      if(sub.id && sub.id!=undefined){
        this.edit=true;
        this.http.get(`http://localhost:4000/api/${sub.id}`).subscribe(
          (data)=>{
            this.users=data;
            this.form.controls['avatar'].setValue(`${this.users.avatar}`)
            this.form.controls['name'].setValue(`${this.users.name}`);
            this.form.controls['email'].setValue(`${this.users.email}`);
            this.form.controls['role'].setValue(`${this.users.role}`);
          },
          (error)=>{
            console.log(error);
          }
        )
      }    
    })
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity();

    //image periview
    // const reader = new FileReader();
    // reader.onload = () => {
    //   this.imageURL = reader.result as string;
    // }
    // reader.readAsDataURL(file)
  }

  submitForm() {
    var formData: any = new FormData();
    formData.append("name", this.form.get('name').value);
    formData.append("email", this.form.get('email').value);
    formData.append("role", this.form.get('role').value);
    formData.append("avatar", this.form.get('avatar').value);

    if(!this.edit){
      this.http.post('http://localhost:4000/api/create-user', formData).subscribe(
        (response) => {
          console.log(response);
          window.alert("Data Saved")
          this.router.navigateByUrl('/');

        },
        (error) => {
          console.log(error);
          window.alert(error.error)
        }
      )
    }
    else{
      console.log('updating ')
        this.http.put(`http://localhost:4000/api/editUser/${this.users._id}`, formData).subscribe(
        (response) => {
          console.log(response);
          window.alert("User Updated")
        this.router.navigateByUrl('/');

        },
        (error) => {
          console.log(error);
          window.alert(error.error)
        }
      )

    }
  }

}
