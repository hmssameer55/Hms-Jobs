import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Share,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { COLORS, icons, images, SIZES } from "@/constants";
import useFetch from "../../hook/useFetch";
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "@/components";

export default function JobDetail() {
  const { id } = useLocalSearchParams();

  const {
    data: _data,
    isLoading,
    error,
    refetch,
  } = useFetch("job-details", {
    job_id: id,
  });

  interface SingleJobProps {
    job_id: string;
    job_title: string;
    employer_name: string;
    job_country: string;
    employer_logo: string;
    job_highlights: {
      Qualifications: string[];
      Responsibilities: string[];
    };
    job_description: string;
    job_google_link: string;
  }

  const data: SingleJobProps[] = _data;

  const tabs = ["About", "Qualifications", "Responsibilities"];

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualifications":
        return (
          <Specifics
            title={"Qualifications"}
            points={data[0].job_highlights?.Qualifications ?? ["N/A"]}
          />
        );
      case "About":
        return <JobAbout info={data[0].job_description} />;
      case "Responsibilities":
        return (
          <Specifics
            title={"Responsibilities"}
            points={data[0].job_highlights?.Responsibilities ?? ["N/A"]}
          />
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={icons.share}
              dimension="60%"
              handlePress={() =>
                Share.share({
                  message: data[0]?.job_google_link ?? "No link found",
                  title: "Share job link",
                })
              }
            />
          ),
          headerTitle: "",
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text style={{ textAlign: "center" }}>Something went wrong</Text>
          ) : data.length == 0 ? (
            <Text style={{ textAlign: "center" }}>No data found</Text>
          ) : (
            <View
              style={{ flex: 1, padding: SIZES.medium, paddingBottom: 100 }}
            >
              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                location={data[0].job_country}
                key={data[0].job_id}
              />
              <JobTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
              />
              {displayTabContent()}
            </View>
          )}
        </ScrollView>
        <JobFooter
          url={
            data[0]?.job_google_link ??
            "https://careers.google.com/jobs/results"
          }
        />
      </>
    </SafeAreaView>
  );
}
