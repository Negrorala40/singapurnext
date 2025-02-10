// public/data/users.ts
export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    google_authenticator_secret: string;
    is_google_auth_enabled: boolean;
    address: {
      street: string;
      city: string;
    };
  }
  
  export const users: User[] = [
    {
      user_id: "1",
      first_name: "Juan",
      last_name: "Pérez",
      email: "admin@gmail.com",
      phone: "+34 654 789 123",
      password: "1234",
      google_authenticator_secret: "null",
      is_google_auth_enabled: false,
      address: {
        street: "null",
        city: "null"
      }
    },
    // Puedes agregar más usuarios aquí si lo necesitas
  ];
  