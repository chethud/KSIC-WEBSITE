/** Clean white studio — hard directional light so faceted silk reads clearly */
export function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.62} color="#fff6ea" />
      <hemisphereLight args={['#ffffff', '#e8e8e8', 0.32]} />
      <directionalLight position={[3.2, 5.8, 2.8]} intensity={1.25} color="#ffffff" />
      <directionalLight position={[-2.6, 2.4, 2.2]} intensity={0.35} color="#f5f6f8" />
      <directionalLight position={[0.15, 3.2, -3.4]} intensity={0.22} color="#ffffff" />
    </>
  );
}
