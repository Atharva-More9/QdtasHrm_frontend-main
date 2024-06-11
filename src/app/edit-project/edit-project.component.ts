import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/userServices';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../model/project';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  @Input() projectId: number;
  projectForm!: FormGroup;
  project: Project = new Project();
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.projectId = parseInt(this.route.snapshot.paramMap.get('projectId')!, 10);
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.initForm();
    this.loadProjectDetails();
    this.scrollToTop();
  }

  initForm(): void {
    console.log('Initializing form');
    this.projectForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      client: ['', Validators.required],
      description: ['', Validators.required],
      teams: ['', Validators.required],
      managers: ['', Validators.required],
      status: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  loadProjectDetails(): void {
    this.isLoading = true;
    console.log('Loading project details...');
    this.userService.getProjectById(this.projectId).subscribe(
      (project: Project) => {
        console.log('Project loaded:', project);
        this.project = project; // Store the project details
        this.projectForm.patchValue(project); // Pre-fill the form fields with existing project details
        this.isLoading = false;
      },
      error => {
        console.error('Error loading project details', error);
        this.isLoading = false;
      }
    );
  }

  updateProject(): void {
    if (this.projectForm.valid) {
      const updatedProject: Project = this.projectForm.value;
      console.log('Updating project with:', updatedProject);
      this.userService.updateProject(this.projectId, updatedProject).subscribe(
        (res: Project) => {
          console.log('Project updated:', res);
          this.project = res;
          this.projectForm.patchValue(this.project);
          if (window.confirm('Details are updated! Do you want to go back?')) {
            this.router.navigate(['../'], { relativeTo: this.route });
          }
        },
        error => {
          console.error('Error updating project', error);
          window.alert('An error occurred while updating project details. Please try again later.');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  cancel(): void {
    console.log('Cancel button clicked, navigating back');
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  scrollToTop(): void {
    console.log('Scrolling to top');
    window.scrollTo(0, 0);
  }
}
