import React, { useContext } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  TextField,
  InputAdornment,
  Badge,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import '../../App.css';
import { Store } from '../Store';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Service', path: '/service' },
  { name: 'Product', path: '/products' },
  { name: 'Blog', path: '/blog' },
  { name: 'About us', path: '/about-us' },
  { name: 'Contact', path: '/contact' },
];
const settings = ['Profile', 'Account', 'Logout'];

function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const SignOutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAdress');
    localStorage.removeItem('paymentMethod');
  };

  console.log('cart item length', cart.cartItems.length);
  return (
    <>
      <AppBar
        className="sub-header-background"
        position="static"
        style={{ backgroundColor: 'black' }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <TextField
              id="input-with-icon-textfield"
              style={{ color: 'white', marginTop: 10, marginRight: 10 }}
              defaultValue="search"
              InputProps={{
                style: { color: 'white' },
                startAdornment: (
                  <InputAdornment position="start" style={{ color: 'white' }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
            <Toolbar disableGutters>
              {cart.cartItems.length > 0 ? (
                <Badge
                  badgeContent={cart.cartItems.reduce(
                    (a, c) => a + c.quantity,
                    0
                  )}
                  color="success"
                >
                  <Link to={'/cart'}>
                    <ShoppingCartOutlinedIcon style={{ color: 'white' }} />
                  </Link>
                </Badge>
              ) : (
                <Link to={'/cart'}>
                  <ShoppingCartOutlinedIcon style={{ color: 'white' }} />
                </Link>
              )}
            </Toolbar>
          </Box>
        </Container>
      </AppBar>

      <AppBar style={{ backgroundColor: 'white' }} position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              className="header-text"
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
              style={{ fontFamily: 'Chilanka' }}
            >
              NAILBEAUTY
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                className="header-text"
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Link
                      to={page.path}
                      className="header-text"
                      variant="body2"
                      style={{ color: 'black', textDecoration: 'none' }}
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Typography
              className="header-text"
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
              style={{ fontFamily: 'Chilanka' }}
            >
              NAILBEAUTY
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {pages.map((page) => (
                <Button
                  className="header-text"
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'black' }}
                >
                  <Link
                    to={page.path}
                    className="header-text"
                    variant="body2"
                    style={{ color: 'black', textDecoration: 'none' }}
                  >
                    {page.name}
                  </Link>
                </Button>
              ))}
            </Box>
            {userInfo ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="User Setting">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Typography textAlign="center">{userInfo.name}</Typography>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">User Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={SignOutHandler}>
                      Sign out
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Typography textAlign="center" style={{ color: 'black' }}>
                <Link to={`/signin`}>Sign In</Link>
              </Typography>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default Header;
