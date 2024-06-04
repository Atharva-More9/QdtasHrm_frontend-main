import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/userServices'; // Update the path to your project service
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../model/project'; // Import the Project model
import { ElementRef } from '@angular/core';


@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  @Input() projectId: number;
  projectForm!: FormGroup;
  project: Project = new Project();
  isLoading :boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef
  ) {
    this.projectId = parseInt(route.snapshot.paramMap.get('projectId')!);
  }

  ngOnInit(): void {
    this.loadProjectDetails();
    this.initForm();
    this.scrollToTop();
  }

  loadProjectDetails(): void {
    this.isLoading=true;
    this.userService.getProjectById(this.projectId).subscribe(
      (project: any) => {
      this.project = project; // Store the project details
      // Pre-fill the form fields with existing project details
      this.projectForm.patchValue({
        projectName: project.projectName,
        client: project.client,
        description: project.description,
        status: project.status,
        type: project.type
      });
        this.isLoading=false;
      },error => {
        this.isLoading=false;
      }
    );
  }

  initForm(): void {
    this.projectForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      client: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  updateProject(value:any): void {
    if (this.projectForm.valid) {
      const updatedProject: Project = this.projectForm.value;
      console.log(updatedProject)
        this.userService.updateProject(this.projectId, updatedProject).subscribe((res:any) => {
          console.log(res)
          window.alert('Details are updated!');
          this.router.navigate(['../'], { relativeTo: this.route }); // Redirect to previous projects page
        });
    }
  }
  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  scrollToTop(): void {window.scrollTo(0, 0);
  }

}
