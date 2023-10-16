import React, {useState, useEffect} from 'react';
import {Text, View, Linking, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {useHelper} from '../../hooks/useHelper';

import styles from './styles';
import HeaderContainer from '../../components/containers/headerContainer';
import BlogServices from '../../services/BlogServices';
import Loader from '../../components/Loader';
import NewBlogCard from '../../components/Cards/NewBlogCard';

const Blog = () => {
  const {handleStatusCode} = useHelper();
  const {token} = useSelector(store => store.userReducer);

  const [loading, setLoading] = useState(false);
  const [blogList, setBlogList] = useState([]);

  const getBlogList = () => {
    setLoading(true);
    BlogServices.blogList(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setBlogList(res.data.data);
        }
      })
      .catch(err => console.log('err', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getBlogList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer Icon name="smileo" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Text style={styles.welcomeText}>Welcome to Rishta Auntie</Text>
          <ScrollView>
            {blogList.length > 0 ? (
              blogList.map((el, index) => {
                return (
                  <View key={index}>
                    <NewBlogCard
                      image={el.imageUrl}
                      title={el.title}
                      onPress={() => Linking.openURL(el.blogUrl)}
                    />
                  </View>
                );
              })
            ) : (
              <View style={styles.noBlogContainer}>
                <Text style={styles.noBlogTxt}>
                  Blogs are currently unavailable!
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default Blog;
