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
  linkText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9747FF',
    textDecorationLine: 'underline',
  },
  secondaryLinkContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryLinkText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9747FF',
    marginHorizontal: 5,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 10,
  },
});
