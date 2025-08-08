import { Canvas } from '@react-three/fiber'
import './App.css'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three' 

function Model({ url }) {
  const { scene } = useGLTF(url)
  const [isDragging, setIsDragging] = useState(false)
  const [lastX, setLastX] = useState(0)

  useEffect(() => {
    const box = new Box3().setFromObject(scene)
    const size = new Vector3()
    box.getSize(size)
    const center = new Vector3()
    box.getCenter(center)

    scene.position.sub(center)

    const maxAxos = Math.max(size.x, size.y, size.z)
    const scaleFactor = 2 / maxAxos
    scene.scale.setScalar(scaleFactor)

    scene.rotation.set(0, Math.PI, 0)
  }, [scene])


  const handlePointerDown = useCallback((event) => {
    setIsDragging(true)
    setLastX(event.clientX)
  }, [])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handlePointerMove = useCallback((event) => {
    if (!isDragging) return
    const deltaX = event.clientX - lastX
    scene.rotation.y += deltaX * 0.02
    setLastX(event.clientX)
  }, [isDragging, lastX, scene])
  return (
    <primitive
     object={scene}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    />
  )
}

function App() {

  return (
    <>
      <h1>Bem-vindo ao Museu Emilio Goeldi</h1>
      <p>Explore a rica história e cultura do Museu Emilio Goeldi.</p>
      <Canvas style={{ width: '100%', height: '500px' }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[8, 2, 7]} />

        <Suspense fallback={null}>
          <Model url='/models/smilodon.glb' />
        </Suspense>
        <OrbitControls enableRotate={false} />
      </Canvas>
    </>
  )
}
export default App