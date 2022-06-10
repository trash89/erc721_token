import MenuAppBar from "./MenuAppBar";
const SharedLayout = ({ children }) => {
  return (
    <>
      <nav>
        <MenuAppBar />
      </nav>
      <main>{children}</main>
      <footer>footer</footer>
    </>
  );
};
export default SharedLayout;
