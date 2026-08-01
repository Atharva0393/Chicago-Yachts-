import AuthForm from "../AuthForm";

export const metadata = { title: "Create Account" };

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
