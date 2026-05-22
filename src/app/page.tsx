import { FaCodeBranch } from 'react-icons/fa'  // git branch symbol
import { lusitana } from './layout';
import LoginForm from '@/components/auth/login-form';

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 relative">
        <div className="absolute inset-0" style={{background: "radial-gradient(ellipse at 30% 50%, rgba(120, 60, 255, 0.35), transparent)"}}></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: "linear-gradient(90deg, rgba(168, 85, 247, 0.07) 1px, transparent 1px), linear-gradient(rgba(168, 85, 247, 0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}></div>
        <div className={`${lusitana.className} flex flex-col justify-center px-20 z-10 gap-4`}>
          <div className='flex w-14 h-14 rounded-xl bg-purple-700 items-center justify-center'>
            <FaCodeBranch size={40} className="text-white/70"/>
          </div>
          <h1 className='text-white text-3xl font-bold mt-2'>GitLog</h1>
          <p className='text-white/40 max-w-sm text-lg'>The modern platform for teams to manage changelogs</p>  
        </div>
      </div>
      <div className="flex flex-2 flex-col items-center justify-center bg-zinc-900">
        <h1 className="text-white text-2xl font-bold">Welcome back</h1>
        <p className="text-white/40 text-sm mt-1">Sign in to your account</p>
        <LoginForm></LoginForm>
      </div>
    </div>
  );
}
