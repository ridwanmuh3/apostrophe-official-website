export default function () {
  const isClosing = useState<boolean>("isClosing", () => false);
  const showMenu = useState<boolean>("showMenu", () => false);
  const menuVisible = useState<boolean>("menuVisible", () => false);

  const closeMenu = () => {
    isClosing.value = true;

    setTimeout(() => {
      isClosing.value = false;
      showMenu.value = false;
      menuVisible.value = false;
    }, 400);
  };

  return {
    showMenu,
    menuVisible,
    isClosing,
    closeMenu,
  };
}
