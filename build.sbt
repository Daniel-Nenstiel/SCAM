name := """scala-play-angular-seed"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala).settings(
  watchSources ++= (baseDirectory.value / "public/ui" ** "*").get
)

resolvers += Resolver.sonatypeRepo("snapshots")

scalaVersion := "2.12.8"

libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.2" % Test
libraryDependencies += "com.h2database" % "h2" % "1.4.199"
libraryDependencies ++= Seq(
  "org.reactivemongo" %% "play2-reactivemongo" % "0.18.0-play27",
  "org.mindrot" % "jbcrypt" % "0.3m",
  )

