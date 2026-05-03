export function AnimatedBackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-background">
      {/* Orb 1 - Cyan */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full animate-orb-1"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(0,212,255,0) 70%)',
          filter: 'blur(80px)'
        }}
      />
      
      {/* Orb 2 - Violet */}
      <div 
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full animate-orb-2"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(124,58,237,0) 70%)',
          filter: 'blur(80px)'
        }}
      />
      
      {/* Orb 3 - Aqua/Navy mix */}
      <div 
        className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full animate-orb-1"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,212,0.1) 0%, rgba(0,100,200,0) 70%)',
          filter: 'blur(60px)',
          animationDelay: '-5s'
        }}
      />
    </div>
  );
}
