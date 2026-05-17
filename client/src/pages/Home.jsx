import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import LoginModals from '../components/LoginModals';
import { useDispatch, useSelector } from 'react-redux';
import { Coins } from "lucide-react"
import api from '../service/api';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function Home() {
  const highLights = [
    "AI Generated Code", "Full Responsive Layout", "Production Ready Output"
  ];

  const [openLogin, setOpenLogin] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const { userData } = useSelector((state) => state.user);
  console.log("userData ", userData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      dispatch(setUserData(null));
      setOpenProfile(false);
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden'>

      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b
         border-white/10'
      >
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <div className='text-lg font-semibold'>
            GenWeb ai
          </div>
          <div className='flex items-center gap-5'>
            <div onClick={() => navigate("/pricing")}
            className='hidden md:inline text-sm text-zinc-400 hover:text-white 
              cursor-pointer'
            >
              Pricing
            </div>
            {/* showing credits */}
            {
              userData && <div onClick={() => navigate("/pricing")}
              className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition'>
                <Coins size={14} className='text-yellow-400' />
                <span className='text-zinc-300'>Credits</span>
                <span>{userData.credits}</span>
                <span className='font-semibold'>+</span>
              </div>
            }
            {/* showing profile avatar */}
            {
              !userData ? (<button onClick={() => setOpenLogin(true)}
                className='px-4 py-2 rounded-lg border border-white/20
             hover:bg-white/10 text-sm'
              >
                Get started
              </button>) : (
                <div className='relative'>
                  <button className='flex item-center' onClick={() => setOpenProfile(!openProfile)}>
                    <img src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}`}
                      className='w-9 h-9 rounded-full object-cover border border-white/20'
                      alt="Profile Image"
                    />
                  </button>
                  <AnimatePresence>
                    {
                      openProfile && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className='absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b]
                        border border-white/10 shadow-2xl overflow-hidden'
                          >
                            <div className='px-4 py-3 border-b border-white/10'>
                              <p className='text-sm font-medium truncate'>{userData.name}</p>
                              <p className='text-sm text-zinc-500 truncate'>{userData.email}</p>
                            </div>

                            <button className='md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm
                              border-b border-white/10 hover:bg-white/5'
                            >
                              <Coins size={14} className='text-yellow-400' />
                              <span className='text-zinc-300'>Credits</span>
                              <span>{userData.credits}</span>
                              <span className='font-semibold'>+</span>
                            </button>

                            <button onClick={() => navigate("/dashboard")}
                              className='w-full px-4 py-3 text-left text-sm hover:bg-white/5
                            cursor-pointer'
                            >
                              Dashboard
                            </button>

                            <button onClick={handleLogout}
                              className='w-full px-4 py-3 text-left text-sm text-red-400
                             hover:bg-white/5 cursor-pointer'>
                              Logout
                            </button>

                          </motion.div>
                        </>
                      )
                    }
                  </AnimatePresence>
                </div>
              )
            }


          </div>
        </div>



      </motion.div>

      <section className='pt-44 pb-32 px-6 text-center'>
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className='text-5xl md:text-7xl font-bold tracking-tight'
        >
          Build Stunning Webiste <br />
          <span className='bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text
          text-transparent'
          >
            with AI
          </span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'
        >
          Describe your idea and let AI generate a modern, responsive, production ready website
        </motion.p>
        <button onClick={() => navigate("/dashboard")}
        className='px-10 py-2 rounded-xl border bg-white
         text-black font-semibold hover:scale-105 trasnition mt-10'
        >
          
          {
            userData ? "Go to Dashboard" : "Get Started"
          }
        </button>

      </section>

      <section className='max-w-7xl mx-auto px-6 pb-32'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {
            highLights.map((highLight, index) => (
              <motion.div
                key={index}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className='p-8 rounded-2xl bg-white/5 border border-white/10'
              >
                <h1 className='text-xl font-semibold mb-3'>
                  {highLight}
                </h1>
                <p className='text-sm text-zinc-400'>
                  Genweb.ai builds real website - clean code, animation responsiveness and
                  scalable structure
                </p>
              </motion.div>
            ))
          }
        </div>

      </section>

      <footer className='border-t border-white/10 py-10 text-center text-sm text-zinc-500'>
        &copy; {new Date().getFullYear()} Genweb ai
      </footer>

      {/* login modal */}
      {
        openLogin && <LoginModals open={openLogin} onClose={() => setOpenLogin(false)} />
      }

    </div>
  )
}

export default Home
