import aws from '@/assets/icon/aws.svg';
import c from '@/assets/icon/c.svg';
import cPlusPlus from '@/assets/icon/c-plus-plus.svg';
import cSharp from '@/assets/icon/c-sharp.svg';
import arduino from '@/assets/icon/devicon_arduino-wordmark.svg';
import hadoop from '@/assets/icon/devicon_hadoop.svg';
import pandas from '@/assets/icon/devicon_pandas.svg';
import redis from '@/assets/icon/devicon_redis-wordmark.svg';
import scikitLearn from '@/assets/icon/devicon_scikitlearn.svg';
import fastApi from '@/assets/icon/fastapi.svg';
import figma from '@/assets/icon/Figma.svg';
import flutter from '@/assets/icon/flutter.svg';
import githubActions from '@/assets/icon/githubactions 1.svg';
import illustrator from '@/assets/icon/Illustrator.svg';
import java from '@/assets/icon/java.svg';
import javascript from '@/assets/icon/javascript.svg';
import jenkins from '@/assets/icon/jenkins 1.svg';
import kotlin from '@/assets/icon/kotlin.svg';
import kubernetes from '@/assets/icon/kubernetes 1.svg';
import node from '@/assets/icon/la_node.svg';
import firebase from '@/assets/icon/logos_firebase-icon.svg';
import go from '@/assets/icon/logos_go.svg';
import postgresql from '@/assets/icon/logos_postgresql.svg';
import mysql from '@/assets/icon/mysql.svg';
import nestjs from '@/assets/icon/nest.js.svg';
import nextjs from '@/assets/icon/next.js.svg';
import openGL from '@/assets/icon/OpenGL.svg';
import oracle from '@/assets/icon/Oracle.svg';
import photoshop from '@/assets/icon/Photoshop.svg';
import python from '@/assets/icon/python.svg';
import pytorch from '@/assets/icon/pytorch.svg';
import raspberryPi from '@/assets/icon/raspberry_pi.svg';
import react from '@/assets/icon/react.svg';
import reactNative from '@/assets/icon/reactnative.svg';
import django from '@/assets/icon/skill-icons_django.svg';
import docker from '@/assets/icon/skill-icons_docker.svg';
import mongodb from '@/assets/icon/skill-icons_mongodb.svg';
import springboot from '@/assets/icon/spring.svg';
import spark from '@/assets/icon/streamline-logos_spark-logo-block.svg';
import svelte from '@/assets/icon/svelte.svg';
import swift from '@/assets/icon/swift.svg';
import tensorflow from '@/assets/icon/tensorflow.svg';
import typescript from '@/assets/icon/typescript.svg';
import unity from '@/assets/icon/unity.svg';
import unrealengine from '@/assets/icon/unreal-engine.svg';
import vue from '@/assets/icon/vue.svg';

export const TECH_SKILL_ICONS: Record<number, string> = {
  // Languages
  9: python,
  31: c,
  27: cPlusPlus,
  26: cSharp,
  7: java,
  1: javascript,
  2: typescript,
  34: swift,
  35: kotlin,
  14: go,

  // Frameworks / Libraries
  8: springboot,
  3: react,
  4: vue,
  5: nextjs,
  13: nestjs,
  37: reactNative,
  36: flutter,
  11: fastApi,
  12: node,
  6: svelte,
  10: django,

  // Data / AI
  20: pytorch,
  21: tensorflow,
  23: pandas,
  22: scikitLearn,
  25: hadoop,

  // Database / Infra / Tools
  15: mysql,
  16: postgresql,
  18: redis,
  38: aws,
  41: firebase,
  40: kubernetes,
  42: jenkins,
  43: githubActions,
  17: mongodb,
  19: oracle,
  24: spark,
  39: docker,

  // Embedded / Others
  33: arduino,
  32: raspberryPi,
  28: unity,
  29: unrealengine,
  30: openGL,

  // design
  44: figma,
  45: photoshop,
  46: illustrator,
};
