import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingTop: 10,
    minHeight: '100%',
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '500',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: 'rgba(0,0,0,0.7)',
  },
  formContainer: {
    width: '100%',
  },
  buttonMargin: {
    marginTop: 10,
    marginBottom: 20,
  },
  linkContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});
