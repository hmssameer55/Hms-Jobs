import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Link, Stack, router } from "expo-router";
import { COLORS, icons, images, SIZES } from "@/constants";
import {
  Nearbyjobs,
  Popularjobs,
  NearbyJobCard,
  Welcome,
  ScreenHeaderBtn,
} from "@/components";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearch() {
    if (!searchTerm) return;
    router.navigate(`/search/${searchTerm}`);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerLeft: () => (
            <Text
              style={{
                fontFamily: "DMBold",
                fontSize: SIZES.xLarge,
                color: COLORS.tertiary,
              }}
            >
              Hms Jobs
            </Text>
          ),
          headerTitle: "",
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
          }}
        >
          <Welcome
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleClick={handleSearch}
          />
          <Popularjobs />
          <Nearbyjobs />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
