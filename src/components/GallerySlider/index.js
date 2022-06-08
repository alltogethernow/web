import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import { Dialog, Drawer, IconButton, Slide } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import CloseIcon from '@mui/icons-material/Close'
import NextIcon from '@mui/icons-material/NavigateNext'
import PrevIcon from '@mui/icons-material/NavigateBefore'
import Post from '../Post'
import Carousel from 'nuka-carousel'
import styles from './style'

const alwaysOpenWidth = 800

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Gallery = ({
  classes,
  open: propOpen,
  startIndex,
  onClose,
  medias,
  onLastPhoto,
  onChange,
  posts,
}) => {
  const [open, setOpen] = useState(propOpen)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [slideIndex, setSlideIndex] = useState(startIndex)
  const [width, setWidth] = useState(document.documentElement.clientWidth)

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      setWidth(document.documentElement.clientWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Watch for startIndex change
  useEffect(() => {
    setSlideIndex(startIndex)
  }, [startIndex])

  // Open and close via prop
  useEffect(() => {
    if (open !== propOpen) {
      setOpen(propOpen)
    }
  }, [propOpen])

  const handleClose = e => {
    setOpen(false)
    if (onClose) {
      onClose()
    }
  }

  const isPermanentDrawer =
    medias.find(media => media.postId) && width > alwaysOpenWidth

  return (
    <Dialog
      disableAutoFocus
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <Carousel
        className={classes.carousel}
        slideIndex={slideIndex}
        afterSlide={index => {
          setSlideIndex(index)
          if (index >= medias.length - 1 && onLastPhoto) {
            onLastPhoto()
          }
          if (onChange) {
            onChange(medias[index])
          }
        }}
        renderCenterLeftControls={({
          previousSlide,
          slideCount,
          currentSlide,
        }) => {
          if (slideCount < 2 || currentSlide < 1) {
            return null
          }
          return (
            <IconButton
              aria-label="Previous Slide"
              className={classes.button}
              style={{ marginLeft: isPermanentDrawer ? 300 : 0 }}
              onClick={previousSlide}
              size="large">
              <PrevIcon />
            </IconButton>
          );
        }}
        renderCenterRightControls={({
          nextSlide,
          slideCount,
          currentSlide,
        }) => {
          if (slideCount < 2 || currentSlide >= slideCount - 1) {
            return null
          }
          return (
            <IconButton
              className={classes.button}
              onClick={nextSlide}
              aria-label="Next Slide"
              size="large">
              <NextIcon />
            </IconButton>
          );
        }}
        renderBottomLeftControls={({ currentSlide }) => {
          if (
            !medias ||
            typeof currentSlide === 'undefined' ||
            !medias[currentSlide] ||
            !medias[currentSlide].postId ||
            isPermanentDrawer
          ) {
            return null
          }
          return (
            <IconButton
              className={classes.button}
              onClick={() => setDrawerOpen(true)}
              aria-label="Show Post"
              size="large">
              <InfoIcon />
            </IconButton>
          );
        }}
        renderTopRightControls={() => (
          <IconButton
            aria-label="Close Slides"
            className={classes.button}
            onClick={handleClose}
            size="large">
            <CloseIcon />
          </IconButton>
        )}
        renderBottomCenterControls={() => null}
        renderTopLeftControls={({ currentSlide }) => {
          if (
            !medias ||
            typeof currentSlide === 'undefined' ||
            !medias[currentSlide] ||
            !medias[currentSlide].postId
          ) {
            return null
          }
          const post = posts.find(
            post => post._id === medias[currentSlide].postId
          )
          return (
            <Drawer
              open={isPermanentDrawer ? true : drawerOpen}
              variant={isPermanentDrawer ? 'permanent' : null}
              onClose={() => setDrawerOpen(false)}
              classes={{
                paperAnchorLeft: classes.drawer,
              }}
            >
              {post && (
                <Post
                  post={post}
                  hideProperties={['photo', 'video', 'featured']}
                  style={{ boxShadow: 'none' }}
                />
              )}
            </Drawer>
          )
        }}
      >
        {medias.map(({ photo, video, poster }, i) => (
          <div
            className={classes.popup}
            key={`slide-${i}`}
            style={{ paddingLeft: isPermanentDrawer ? 300 : 0 }}
          >
            {photo && <img className={classes.popupMedia} src={photo} alt="" />}
            {video && (
              <video
                className={classes.popupMedia}
                src={video}
                poster={poster}
                controls
                loop
              />
            )}
          </div>
        ))}
      </Carousel>
    </Dialog>
  );
}

Gallery.defaultProps = {
  medias: [],
  startIndex: 0,
}

Gallery.propTypes = {
  medias: PropTypes.array.isRequired,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onLastPhoto: PropTypes.func,
  startIndex: PropTypes.number,
}

export default withStyles(styles)(Gallery)
