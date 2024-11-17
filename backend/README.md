# API Documentation for Thread Management

This document provides information on how to use the provided API endpoints for managing threads and messages in a chat application. The endpoints allow you to create threads, add messages to threads, and retrieve messages from threads.

## Base URL
The base URL for the API is http://91.147.92.228:3000

## Table of Contents
1. [Endpoints](#endpoints)
2. [Create a Thread](#create-a-thread)
3. [Add a Message to a Thread](#add-a-message-to-a-thread)
4. [Get Thread Messages](#get-thread-messages)
5. [Example Usage](#example-usage)

## Endpoints

### 1. Create a Thread
- **URL:** `/createThread`
- **Method:** `POST`
- **Description:** Creates a new thread and returns the thread ID.
- **Response:**
  - `id` (string): The ID of the newly created thread.

### 2. Add a Message to a Thread
- **URL:** `/addMessageToThread`
- **Method:** `POST`
- **Description:** Adds a message to a specified thread and runs the assistant to generate a response. Returns the assistant's response.
- **Request Body:**
  - `threadId` (string): The ID of the thread to which the message will be added.
  - `assistantId` (string): The ID of the assistant that will process the message.
  - `message` (string): The message content to be added to the thread.
- **Response:**
  - `answer` (string): The response generated by the assistant.

### 3. Get Thread Messages
- **URL:** `/getThreadMessages`
- **Method:** `GET`
- **Description:** Retrieves all messages from a specified thread.
- **Query Parameters:**
  - `threadId` (string): The ID of the thread from which to retrieve messages.
- **Response:**
    - `messages` (list of objects): A list of message objects in the specified thread.