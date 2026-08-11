import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ScrollView,
} from "react-native";

const API_URL = "http://127.0.0.1:8000";

export default function DynamicForm({ formId }) {
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      const response = await fetch(`${API_URL}/forms/${formId}`);

      if (!response.ok) {
        throw new Error("Erro ao carregar formulário");
      }

      const data = await response.json();

      setForm(data);
    } catch (error) {
      console.error(error);
    }
  };

  const setValue = (fieldId, value) => {
    setAnswers((previous) => ({
      ...previous,
      [fieldId]: value,
    }));
  };

  const renderField = (field) => {
    switch (field.field_type) {
      /*
       * TEXT
       */
      case "text":
        return (
          <TextInput
            value={answers[field.id] ?? ""}
            onChangeText={(value) => setValue(field.id, value)}
          />
        );

      /*
       * TEXTAREA
       */
      case "textarea":
        return (
          <TextInput
            multiline
            numberOfLines={5}
            value={answers[field.id] ?? ""}
            onChangeText={(value) => setValue(field.id, value)}
          />
        );

      /*
       * NUMBER
       */
      case "number":
        return (
          <TextInput
            keyboardType="numeric"
            value={answers[field.id]?.toString() ?? ""}
            onChangeText={(value) =>
              setValue(field.id, Number(value))
            }
          />
        );

      /*
       * BOOLEAN
       */
      case "boolean":
        return (
          <Switch
            value={answers[field.id] ?? false}
            onValueChange={(value) =>
              setValue(field.id, value)
            }
          />
        );

      /*
       * RATING
       */
      case "rating": {
        const min = field.config?.min ?? 1;
        const max = field.config?.max ?? 5;

        const values = Array.from(
          {
            length: max - min + 1,
          },
          (_, index) => min + index,
        );

        return (
          <View>
            {values.map((value) => (
              <Pressable
                key={value}
                onPress={() =>
                  setValue(field.id, value)
                }
              >
                <Text>{value}</Text>
              </Pressable>
            ))}
          </View>
        );
      }

      default:
        return (
          <Text>
            Tipo não suportado: {field.field_type}
          </Text>
        );
    }
  };

  const submitForm = async () => {
    const data = {
      submitted_by: "João Manuel",

      answers: Object.entries(answers).map(
        ([fieldId, value]) => ({
          field_id: Number(fieldId),
          value: value,
        }),
      ),
    };

    try {
      const response = await fetch(
        `${API_URL}/forms/${formId}/submissions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error(result);
        return;
      }

      console.log("Formulário submetido:", result);
    } catch (error) {
      console.error(error);
    }
  };

  if (!form) {
    return <Text>Carregando formulário...</Text>;
  }

  return (
    <ScrollView>
      <Text>{form.name}</Text>

      <Text>{form.description}</Text>

      {form.fields.map((field) => (
        <View key={field.id}>
          <Text>
            {field.label}
            {field.required && <Text> *</Text>}
          </Text>

          {renderField(field)}
        </View>
      ))}

      <Pressable onPress={submitForm}>
        <Text>Submeter avaliação</Text>
      </Pressable>
    </ScrollView>
  );
}


































































































// import React, { useEffect, useState } from "react";

// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   Switch,
//   StyleSheet,
//   ScrollView,
// } from "react-native";

// const API_URL = "http://127.0.0.1:8000";
// export default function DynamicForm({ formId }) {
//   const [form, setForm] = useState(null);

//   const [answers, setAnswers] = useState({});

//   useEffect(() => {
//     loadForm();
//   }, [formId]);

//   const loadForm = async () => {
//     try {
//       const response = await fetch(`${API_URL}/forms/${formId}`);

//       if (!response.ok) {
//         throw new Error("Erro ao carregar formulário");
//       }

//       const data = await response.json();

//       setForm(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const setValue = (fieldId, value) => {
//     setAnswers((previous) => ({
//       ...previous,
//       [fieldId]: value,
//     }));
//   };

//   const renderField = (field) => {
//     switch (field.field_type) {
//       /*
//        * TEXT
//        */
//       case "text":
//         return (
//           <TextInput
//             style={styles.input}
//             value={answers[field.id] ?? ""}
//             onChangeText={(value) => setValue(field.id, value)}
//           />
//         );

        
//       /*
//        * TEXTAREA
//        */
//       case "textarea":
//         return (
//           <TextInput
//             style={[styles.input, styles.textarea]}
//             multiline
//             numberOfLines={5}
//             value={answers[field.id] ?? ""}
//             onChangeText={(value) => setValue(field.id, value)}
//           />
//         );

//       /*
//        * NUMBER
//        */
//       case "number":
//         return (
//           <TextInput
//             style={styles.input}
//             keyboardType="numeric"
//             value={answers[field.id]?.toString() ?? ""}
//             onChangeText={(value) => setValue(field.id, Number(value))}
//           />
//         );

//       /*
//        * BOOLEAN
//        */
//       case "boolean":
//         return (
//           <Switch
//             value={answers[field.id] ?? false}
//             onValueChange={(value) => setValue(field.id, value)}
//           />
//         );

//       /*
//        * RATING
//        */
//       case "rating":
//         const min = field.config?.min ?? 1;

//         const max = field.config?.max ?? 5;

//         const values = Array.from(
//           {
//             length: max - min + 1,
//           },
//           (_, index) => min + index,
//         );

//         return (
//           <View style={styles.ratingContainer}>
//             {values.map((value) => (
//               <Pressable
//                 key={value}
//                 style={[
//                   styles.ratingButton,

//                   answers[field.id] === value && styles.selected,
//                 ]}
//                 onPress={() => setValue(field.id, value)}
//               >
//                 <Text>{value}</Text>
//               </Pressable>
//             ))}
//           </View>
//         );

//       default:
//         return <Text>Tipo não suportado: {field.field_type}</Text>;
//     }
//   };

//   const submitForm = async () => {
//     const data = {
//       submitted_by: "João Manuel",

//       answers: Object.entries(answers).map(([fieldId, value]) => ({
//         field_id: Number(fieldId),
//         value: value,
//       })),
//     };

//     try {
//       const response = await fetch(`${API_URL}/forms/${formId}/submissions`, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         console.error(result);

//         return;
//       }

//       console.log("Formulário submetido:", result);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (!form) {
//     return <Text>Carregando formulário...</Text>;
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>{form.name}</Text>

//       <Text style={styles.description}>{form.description}</Text>

//       {form.fields.map((field) => (
//         <View key={field.id} style={styles.fieldContainer}>
//           <Text style={styles.label}>
//             {field.label}

//             {field.required && <Text> *</Text>}
//           </Text>

//           {renderField(field)}
//         </View>
//       ))}

//       <Pressable style={styles.submitButton} onPress={submitForm}>
//         <Text style={styles.submitText}>Submeter avaliação</Text>
//       </Pressable>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },

//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },

//   description: {
//     fontSize: 15,
//     marginBottom: 25,
//   },

//   fieldContainer: {
//     marginBottom: 25,
//   },

//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 10,
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#cccccc",
//     borderRadius: 8,
//     padding: 12,
//   },

//   textarea: {
//     minHeight: 100,
//     textAlignVertical: "top",
//   },

//   ratingContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },

//   ratingButton: {
//     borderWidth: 1,
//     borderColor: "#cccccc",
//     padding: 12,
//     borderRadius: 8,
//   },

//   selected: {
//     borderWidth: 2,
//   },

//   submitButton: {
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     backgroundColor: "#222",
//   },

//   submitText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });


