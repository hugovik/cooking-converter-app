import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';
import ThreadsIcon from './ThreadsIcon';  // Import the custom Threads icon
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

const SocialLinks = () => {
  const socialLinks = [
    {
      icon: <GithubIcon size={20} />,
      label: 'GitHub',
      url: 'https://github.com/hugovik',
    },
    {
      icon: <LinkedinIcon size={20} />,
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/vitaliypavliuk/',
    },
    {
      icon: <ThreadsIcon size={20} />,
      label: 'Threads',
      url: 'https://www.threads.net/@vitaliy_pavliuk',
    },
    {
      icon: <MailIcon size={20} />,
      label: 'Email',
      url: 'mailto:vitaliy.pavlyuk79@gmail.com',
    },
  ];

  return (
    <Box
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 4,
        pt: 2,
        pb: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: '0.875rem'
        }}
      >
        Connect with me
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'center'
        }}
      >
        {socialLinks.map(({ icon, label, url }) => (
          <Tooltip key={label} title={label}>
            <IconButton
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              {icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
      {/* <Typography
        variant="body2"
        sx={{
          marginTop: 4,
          color: 'text.secondary',
          fontSize: '0.875rem'
        }}
      >
        Copyright 2025
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: '0.875rem',
          marginBottom: -5
        }}
      >
       Vitaliy Pavlyuk
      </Typography> */}
    </Box>
  );
};

export default SocialLinks;