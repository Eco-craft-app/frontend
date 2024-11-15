import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { KeycloakOperationService } from '../../services/keycloak.service';

@Component({
  selector: 'app-recycle-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recycle-user-edit.component.html',
  styleUrl: './recycle-user-edit.component.scss',
})
export class RecycleUserEditComponent {
  private keycloakService = inject(KeycloakOperationService);
  private toastrService = inject(ToastrService);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router)
  isSet = computed(() => this.userService.haveSetProfile());
  isProfileSet = signal<boolean>(true);
  profileInfo = JSON.parse(localStorage.getItem('isProfileSet')!);
  profileData = signal<any>(undefined);
  imageUrlString = signal<string | null>(null);
  // defaultUserAvatar = 'https://res.cloudinary.com/recycle/image/upload/v1731586010/default-user-recycle_flents.webp'
  defaultUserAvatar = 'https://res.cloudinary.com/recycle/image/upload/v1731617035/default-user-circle_pyln48.png'

  ngAfterViewnInit() {
    console.log(this.form);
    if (this.profileData()) {
      this.form.get('location')?.setValue(this.profileData().location);
      this.form.get('username')?.setValue(this.profileData().userName);
      this.form.get('bio')?.setValue(this.profileData().bio);
    }
  }

  Cancel() {
    this.router.navigate(['/recycle', 'profile', this.profileData().userId, 'projects']);
  }

  async ngOnInit() {
    console.log(await this.keycloakService.getUserDatas());
    console.log(this.form);
    console.log(this.profileInfo);
    const userData = await this.keycloakService.getUserDatas();
    console.log(userData)
    const sub = this.userService.getUserProfile(userData.profile.id!).subscribe({
      next: (data: any) => {
        console.log(data);
        this.form.get('location')?.setValue(data.location);
        this.form.get('username')?.setValue(data.userName);
        this.form.get('bio')?.setValue(data.bio);
        this.profileData.set(data);
        this.imageUrlString.set(data.avatarUrl);
        this.isProfileSet.set(true);
        this.userService.haveSetProfile.set(true);
        localStorage.setItem('isProfileSet', JSON.stringify(true));
      },
      error: (err: any) => {
        this.isProfileSet.set(false);
        this.userService.haveSetProfile.set(false);
        localStorage.setItem('isProfileSet', JSON.stringify(false));
        console.log(this.isProfileSet());
      },
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
    console.log(this.isProfileSet());
  }

  constructor() {
    // console.log(this.form);
    // console.log(this.profileInfo);
    // const userData = this.keycloakService.getUserDatas();
    // const user = JSON.parse(localStorage.getItem('userInfoData')!);
    // console.log(user)
    // console.log(userData)
    // const sub = this.userService.getUserProfile(user.id).subscribe({
    //   next: (data: any) => {
    //     console.log(data);
    //     this.form.get('location')?.setValue(data.location);
    //     this.form.get('username')?.setValue(data.userName);
    //     this.form.get('bio')?.setValue(data.bio);
    //     this.profileData.set(data);
    //     this.imageUrlString.set(data.avatarUrl);
    //     this.isProfileSet.set(true);
    //     localStorage.setItem('isProfileSet', JSON.stringify(true));
    //   },
    //   error: (err: any) => {
    //     this.isProfileSet.set(false);
    //     localStorage.setItem('isProfileSet', JSON.stringify(false));
    //     console.log(this.isProfileSet());
    //   },
    // });

    // this.destroyRef.onDestroy(() => {
    //   sub.unsubscribe();
    // });
    // console.log(this.isProfileSet());
  }

  imageUrl: string | ArrayBuffer | null = null;
  fileInfo: File | null = null;

  uploadResponse: any = null;
  cloudinaryUrl = 'https://api.cloudinary.com/v1_1/recycle/image/upload';
  uploadPreset = 'new-project';

  form = new FormGroup({
    location: new FormControl('', [Validators.required]),
    username: new FormControl(''),
    bio: new FormControl('', [Validators.required]),
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Sprawdzenie typu pliku
    if (!this.isValidFileType(file)) {
      alert('Proszę wybrać plik typu .png, .jpg lub .jpeg.');
      return;
    }

    this.fileInfo = file;

    // Odczytanie pliku i wyświetlenie podglądu
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrlString.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  // Funkcja sprawdzająca poprawność typu pliku
  isValidFileType(file: File): boolean {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    return allowedTypes.includes(file.type);
  }

  async onSubmit() {
    const avatar = await this.uploadToCloudinary();
    const profileJSON = localStorage.getItem('userInfoData');
    const profileData = JSON.parse(profileJSON!);
    const userProfileData = {
      avatarUrl: avatar !== undefined ? avatar : this.defaultUserAvatar,
      location: this.form.get('location')?.value,
      userName: profileData.username,
      bio: this.form.get('bio')?.value,
    };
    console.log(userProfileData);

    if (this.form.invalid) {
      this.toastrService.error('Wszystkie pola są wymagane.');
      return;
    }

    if(this.isProfileSet()) {
      const sub = this.userService.updateUserProfile(userProfileData).subscribe({
        next: (data: any) => {
          console.log(data);
          this.userService.haveSetProfile.set(true);
          console.log(this.userService.haveSetProfile());
          localStorage.setItem('isProfileSet', JSON.stringify(true));
          this.toastrService.success('Profil został pomyślnie zaktualizowany.');
        },
        error: (err: any) => {
          this.toastrService.error('Wystąpił błąd podczas aktualizacji profilu.');
        }
      });

      this.destroyRef.onDestroy(() => {
        sub.unsubscribe();
      });
      console.log(userProfileData);
    } else {
      const sub = this.userService.addUserProfile(userProfileData).subscribe({
        next: (data: any) => {
          console.log(data);
          this.userService.haveSetProfile.set(true);
          console.log(this.userService.haveSetProfile());
          localStorage.setItem('isProfileSet', JSON.stringify(true));
          this.toastrService.success('Profil został pomyślnie dodany');
          this.router.navigate(['/recycle']);
        },
        error: (err: any) => {
          this.toastrService.error('Wystąpił błąd podczas dodawania profilu.');
        }
      });
  
      this.destroyRef.onDestroy(() => {
        sub.unsubscribe();
      });
    }
    console.log(userProfileData);
  }

  async uploadToCloudinary(): Promise<void> {
    if (!this.fileInfo) return;

    const formData = new FormData();
    formData.append('file', this.fileInfo);
    formData.append('upload_preset', this.uploadPreset);
    console.log(formData);

    try {
      const response = await axios.post(this.cloudinaryUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);

      return response.data.secure_url;
    } catch (error) {
      console.error('Błąd podczas wysyłania na Cloudinary:', error);
      alert('Wystąpił błąd podczas wysyłania zdjęcia.');
    }
  }
}
