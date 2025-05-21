import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import EmailIcon from '@mui/icons-material/Email';
import  AsyncAccessIcon from '../../home-page/components/AsyncAccessIcon';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const items = [
  {
    icon: <EmailIcon sx={{ color: 'text.secondary' }} />,
    title: 'Request Password Reset',
    description:
      'A reset code will arrive to the Email you provided if it exists.',
  },
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Enter Reset Code',
    description:
      'Once you receive the code, enter it along with your email to proceed.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Reset Your Password',
    description:
      'After successful code verification, you can set a new password for your account.',
  },
  {
    icon: <QuestionAnswerIcon sx={{ color: 'text.secondary' }} />,
    title: 'Didn\'t Receive the Code?',
    description:
      'Check your junk/spam folder. Ensure the email address provided is correct and valid.',
  },

];
export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <AsyncAccessIcon />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
