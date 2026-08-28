```tsx
// designSystem.tsx
// visionOS-style React Native design system (Expo-first, RN fallback)

import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { BlurView } from "expo-blur";

/* ============================================================
   TOKENS
   ============================================================ */

export const DS = {
  colors: {
    // base
    surface: "#FFFFFF",
    surfaceDim: "rgba(255,255,255,0.96)",
    surfaceDark: "#050509",
    surfaceDarkDim: "rgba(5,5,9,0.96)",

    // glass / materials
    glassLight: "rgba(255,255,255,0.75)",
    glassHeavy: "rgba(255,255,255,0.55)",
    glassDark: "rgba(20,20,30,0.75)",
    glassDarkHeavy: "rgba(20,20,30,0.55)",

    recessedLight: "rgba(240,240,245,1)",
    recessedDark: "rgba(18,18,24,1)",

    overlayNeutralLight: "rgba(255,255,255,0.18)",
    overlayNeutralDark: "rgba(0,0,0,0.35)",

    // borders
    borderLight: "rgba(255,255,255,0.16)",
    borderHeavy: "rgba(255,255,255,0.28)",
    borderDarkLight: "rgba(255,255,255,0.12)",
    borderDarkHeavy: "rgba(255,255,255,0.24)",

    // text
    textPrimary: "#000000",
    textSecondary: "rgba(0,0,0,0.6)",
    textTertiary: "rgba(0,0,0,0.35)",
    textPrimaryDark: "#FFFFFF",
    textSecondaryDark: "rgba(255,255,255,0.7)",
    textTertiaryDark: "rgba(255,255,255,0.45)",

    // accents
    accentBlue: "#0A84FF",
    accentGreen: "#30D158",
    accentRed: "#FF453A",
    accentOrange: "#FF9F0A",
    accentPurple: "#BF5AF2",
    accentTeal: "#64D2FF",

    // status
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF453A",
    info: "#0A84FF",
  },

  typography: {
    font: {
      regular: "SF Pro Text",
      medium: "SF Pro Text Medium",
      semibold: "SF Pro Text Semibold",
      bold: "SF Pro Text Bold",
    },
    size: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 20,
      xxl: 24,
      displaySm: 28,
      displayMd: 34,
      displayLg: 40,
    },
    lineHeight: {
      tight: 1.1,
      normal: 1.3,
      relaxed: 1.45,
    },
  },

  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 22,
    xl: 32,
    card: 24,
    sheet: 32,
    full: 999,
  },

  shadows: {
    subtle: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    medium: {
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 8 },
    },
    heavy: {
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 48,
      shadowOffset: { width: 0, height: 16 },
    },
    glow: {
      shadowColor: "#FFF",
      shadowOpacity: 0.35,
      shadowRadius: 32,
      shadowOffset: { width: 0, height: 0 },
    },
    recessed: {
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
    },
  },

  blur: {
    light: 12,
    medium: 20,
    heavy: 32,
    sheet: 40,
  },

  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
};

/* ============================================================
   THEMES
   ============================================================ */

export const theme = {
  light: {
    background: DS.colors.surfaceDim,
    textPrimary: DS.colors.textPrimary,
    textSecondary: DS.colors.textSecondary,
    textTertiary: DS.colors.textTertiary,
    glass: DS.colors.glassLight,
    glassHeavy: DS.colors.glassHeavy,
    recessed: DS.colors.recessedLight,
    overlayNeutral: DS.colors.overlayNeutralLight,
    borderLight: DS.colors.borderLight,
    borderHeavy: DS.colors.borderHeavy,
  },
  dark: {
    background: DS.colors.surfaceDarkDim,
    textPrimary: DS.colors.textPrimaryDark,
    textSecondary: DS.colors.textSecondaryDark,
    textTertiary: DS.colors.textTertiaryDark,
    glass: DS.colors.glassDark,
    glassHeavy: DS.colors.glassDarkHeavy,
    recessed: DS.colors.recessedDark,
    overlayNeutral: DS.colors.overlayNeutralDark,
    borderLight: DS.colors.borderDarkLight,
    borderHeavy: DS.colors.borderDarkHeavy,
  },
};

/* ============================================================
   UTILITIES — Glass, Recessed, Motion, Layout
   ============================================================ */

export const glass = {
  panel: (mode: "light" | "dark" = "light") => ({
    backgroundColor:
      mode === "light" ? theme.light.glass : theme.dark.glass,
    borderColor:
      mode === "light" ? theme.light.borderLight : theme.dark.borderLight,
    borderWidth: 1,
    borderRadius: DS.radius.card,
  }),
  heavy: (mode: "light" | "dark" = "light") => ({
    backgroundColor:
      mode === "light" ? theme.light.glassHeavy : theme.dark.glassHeavy,
    borderColor:
      mode === "light" ? theme.light.borderHeavy : theme.dark.borderHeavy,
    borderWidth: 1,
    borderRadius: DS.radius.card,
  }),
};

export const recessed = {
  surface: (mode: "light" | "dark" = "light") => ({
    backgroundColor:
      mode === "light" ? theme.light.recessed : theme.dark.recessed,
    borderRadius: DS.radius.card,
    ...DS.shadows.recessed,
  }),
};

export const motion = {
  pressable: ({ pressed }: { pressed: boolean }) => ({
    transform: [{ scale: pressed ? 0.97 : 1 }],
    opacity: pressed ? 0.9 : 1,
  }),
};

export const layout = {
  stack: {
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    column: {
      flexDirection: "column",
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    spaceBetween: {
      justifyContent: "space-between",
    },
  },
};

/* ============================================================
   CORE COMPONENTS (Expo-first)
   ============================================================ */

type Mode = "light" | "dark";

export const Panel = ({
  children,
  mode = "light",
  intensity = DS.blur.medium,
}: {
  children: React.ReactNode;
  mode?: Mode;
  intensity?: number;
}) => (
  <BlurView
    intensity={intensity}
    tint={mode === "light" ? "light" : "dark"}
    style={[
      glass.panel(mode),
      DS.shadows.medium,
      { padding: DS.spacing.lg },
    ]}
  >
    {children}
  </BlurView>
);

export const Button = ({
  label,
  onPress,
  mode = "light",
  variant = "primary",
}: {
  label: string;
  onPress?: () => void;
  mode?: Mode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
}) => {
  const bg =
    variant === "primary"
      ? DS.colors.accentBlue
      : variant === "destructive"
      ? DS.colors.accentRed
      : mode === "light"
      ? theme.light.glass
      : theme.dark.glass;

  const textColor =
    variant === "primary" || variant === "destructive"
      ? "#FFFFFF"
      : mode === "light"
      ? theme.light.textPrimary
      : theme.dark.textPrimary;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => motion.pressable({ pressed })}>
      <BlurView
        intensity={DS.blur.light}
        tint={mode === "light" ? "light" : "dark"}
        style={[
          {
            height: 48,
            paddingHorizontal: DS.spacing.lg,
            borderRadius: DS.radius.md,
            backgroundColor: bg,
            justifyContent: "center",
            alignItems: "center",
          },
          DS.shadows.subtle,
        ]}
      >
        <Text
          style={{
            fontFamily: DS.typography.font.medium,
            fontSize: DS.typography.size.md,
            color: textColor,
          }}
        >
          {label}
        </Text>
      </BlurView>
    </Pressable>
  );
};

export const InputField = ({
  label,
  value,
  mode = "light",
}: {
  label?: string;
  value?: string;
  mode?: Mode;
}) => (
  <BlurView
    intensity={DS.blur.light}
    tint={mode === "light" ? "light" : "dark"}
    style={[
      {
        height: 52,
        paddingHorizontal: DS.spacing.md,
        borderRadius: DS.radius.md,
        backgroundColor:
          mode === "light" ? theme.light.glassHeavy : theme.dark.glassHeavy,
        borderColor:
          mode === "light" ? theme.light.borderHeavy : theme.dark.borderHeavy,
        borderWidth: 1,
        justifyContent: "center",
      },
    ]}
  >
    {label && (
      <Text
        style={{
          fontFamily: DS.typography.font.medium,
          fontSize: DS.typography.size.xs,
          color:
            mode === "light"
              ? theme.light.textSecondary
              : theme.dark.textSecondary,
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
    )}
    <Text
      style={{
        fontFamily: DS.typography.font.regular,
        fontSize: DS.typography.size.md,
        color:
          mode === "light"
            ? theme.light.textPrimary
            : theme.dark.textPrimary,
      }}
    >
      {value ?? ""}
    </Text>
  </BlurView>
);

export const ListItem = ({
  title,
  subtitle,
  mode = "light",
}: {
  title: string;
  subtitle?: string;
  mode?: Mode;
}) => (
  <View
    style={{
      height: 56,
      paddingHorizontal: DS.spacing.md,
      justifyContent: "center",
      borderBottomWidth: 1,
      borderBottomColor:
        mode === "light" ? theme.light.borderLight : theme.dark.borderLight,
    }}
  >
    <Text
      style={{
        fontFamily: DS.typography.font.medium,
        fontSize: DS.typography.size.md,
        color:
          mode === "light"
            ? theme.light.textPrimary
            : theme.dark.textPrimary,
      }}
    >
      {title}
    </Text>
    {subtitle && (
      <Text
        style={{
          fontFamily: DS.typography.font.regular,
          fontSize: DS.typography.size.sm,
          color:
            mode === "light"
              ? theme.light.textSecondary
              : theme.dark.textSecondary,
        }}
      >
        {subtitle}
      </Text>
    )}
  </View>
);

export const NavBar = ({
  title,
  mode = "light",
}: {
  title: string;
  mode?: Mode;
}) => (
  <BlurView
    intensity={DS.blur.medium}
    tint={mode === "light" ? "light" : "dark"}
    style={[
      {
        height: 64,
        paddingHorizontal: DS.spacing.lg,
        justifyContent: "center",
        backgroundColor:
          mode === "light" ? theme.light.glass : theme.dark.glass,
      },
      DS.shadows.medium,
    ]}
  >
    <Text
      style={{
        fontFamily: DS.typography.font.semibold,
        fontSize: DS.typography.size.lg,
        color:
          mode === "light"
            ? theme.light.textPrimary
            : theme.dark.textPrimary,
      }}
    >
      {title}
    </Text>
  </BlurView>
);

export const Toolbar = ({
  children,
  mode = "light",
}: {
  children: React.ReactNode;
  mode?: Mode;
}) => (
  <BlurView
    intensity={DS.blur.medium}
    tint={mode === "light" ? "light" : "dark"}
    style={[
      {
        height: 52,
        paddingHorizontal: DS.spacing.md,
        borderRadius: DS.radius.md,
        backgroundColor:
          mode === "light" ? theme.light.glassHeavy : theme.dark.glassHeavy,
        flexDirection: "row",
        alignItems: "center",
      },
      DS.shadows.subtle,
    ]}
  >
    {children}
  </BlurView>
);

export const Alert = ({
  title,
  message,
  mode = "light",
  tone = "info",
}: {
  title: string;
  message: string;
  mode?: Mode;
  tone?: "info" | "success" | "warning" | "error";
}) => {
  const toneColor =
    tone === "info"
      ? DS.colors.accentBlue
      : tone === "success"
      ? DS.colors.success
      : tone === "warning"
      ? DS.colors.warning
      : DS.colors.error;

  return (
    <BlurView
      intensity={DS.blur.heavy}
      tint={mode === "light" ? "light" : "dark"}
      style={[
        {
          padding: DS.spacing.xl,
          borderRadius: DS.radius.lg,
          backgroundColor:
            mode === "light" ? theme.light.glass : theme.dark.glass,
          borderColor: toneColor,
          borderWidth: 1,
        },
        DS.shadows.heavy,
      ]}
    >
      <Text
        style={{
          fontFamily: DS.typography.font.bold,
          fontSize: DS.typography.size.lg,
          marginBottom: DS.spacing.xs,
          color:
            mode === "light"
              ? theme.light.textPrimary
              : theme.dark.textPrimary,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: DS.typography.font.regular,
          fontSize: DS.typography.size.md,
          color:
            mode === "light"
              ? theme.light.textSecondary
              : theme.dark.textSecondary,
        }}
      >
        {message}
      </Text>
    </BlurView>
  );
};

/* ============================================================
   CARDS / TABLES / STATS / ICON CARDS
   ============================================================ */

export const StatCard = ({
  label,
  value,
  mode = "light",
}: {
  label: string;
  value: string;
  mode?: Mode;
}) => (
  <BlurView
    intensity={DS.blur.medium}
    tint={mode === "light" ? "light" : "dark"}
    style={[
      glass.panel(mode),
      DS.shadows.medium,
      { padding: DS.spacing.lg },
    ]}
  >
    <Text
      style={{
        fontFamily: DS.typography.font.medium,
        fontSize: DS.typography.size.sm,
        color:
          mode === "light"
            ? theme.light.textSecondary
            : theme.dark.textSecondary,
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        fontFamily: DS.typography.font.bold,
        fontSize: DS.typography.size.displaySm,
        color:
          mode === "light"
            ? theme.light.textPrimary
            : theme.dark.textPrimary,
        marginTop: DS.spacing.xs,
      }}
    >
      {value}
    </Text>
  </BlurView>
);

export const TableRow = ({
  cells,
  mode = "light",
}: {
  cells: string[];
  mode?: Mode;
}) => (
  <View
    style={{
      flexDirection: "row",
      paddingVertical: DS.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor:
        mode === "light" ? theme.light.borderLight : theme.dark.borderLight,
    }}
  >
    {cells.map((cell, i) => (
      <View key={i} style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: DS.typography.font.regular,
            fontSize: DS.typography.size.sm,
            color:
              mode === "light"
                ? theme.light.textPrimary
                : theme.dark.textPrimary,
          }}
        >
          {cell}
        </Text>
      </View>
    ))}
  </View>
);

export const IconCard = ({
  icon,
  title,
  subtitle,
  mode = "light",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  mode?: Mode;
}) => (
  <BlurView
    intensity={DS.blur.medium}
    tint={mode === "light" ? "light" : "dark"}
    style={[
      glass.panel(mode),
      DS.shadows.medium,
      { padding: DS.spacing.lg, flexDirection: "row", alignItems: "center" },
    ]}
  >
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: DS.radius.full,
        backgroundColor: DS.colors.overlayNeutralLight,
        justifyContent: "center",
        alignItems: "center",
        marginRight: DS.spacing.md,
      }}
    >
      {icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontFamily: DS.typography.font.medium,
          fontSize: DS.typography.size.md,
          color:
            mode === "light"
              ? theme.light.textPrimary
              : theme.dark.textPrimary,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontFamily: DS.typography.font.regular,
            fontSize: DS.typography.size.sm,
            color:
              mode === "light"
                ? theme.light.textSecondary
                : theme.dark.textSecondary,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  </BlurView>
);

/* ============================================================
   SHEET / MODAL
   ============================================================ */

export const Sheet = ({
  children,
  mode = "light",
}: {
  children: React.ReactNode;
  mode?: Mode;
}) => (
  <BlurView
    intensity={DS.blur.sheet}
    tint={mode === "light" ? "light" : "dark"}
    style={[
      {
        borderRadius: DS.radius.sheet,
        padding: DS.spacing.xxl,
        backgroundColor:
          mode === "light" ? theme.light.glassHeavy : theme.dark.glassHeavy,
      },
      DS.shadows.heavy,
    ]}
  >
    {children}
  </BlurView>
);

/* ============================================================
   CONTROLS
   ============================================================ */

export const Toggle = ({
  label,
  value,
  onValueChange,
  mode = "light",
}: {
  label: string;
  value: boolean;
  onValueChange?: (v: boolean) => void;
  mode?: Mode;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: DS.spacing.sm,
    }}
  >
    <Text
      style={{
        fontFamily: DS.typography.font.regular,
        fontSize: DS.typography.size.md,
        color:
          mode === "light"
            ? theme.light.textPrimary
            : theme.dark.textPrimary,
      }}
    >
      {label}
    </Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false:
          mode === "light"
            ? theme.light.overlayNeutral
            : theme.dark.overlayNeutral,
        true: DS.colors.accentBlue,
      }}
      thumbColor="#FFFFFF"
    />
  </View>
);

/* ============================================================
   PURE RN FALLBACK (no blur)
   ============================================================ */

export const RNFallback = {
  Panel: ({
    children,
    mode = "light",
  }: {
    children: React.ReactNode;
    mode?: Mode;
  }) => (
    <View
      style={[
        glass.panel(mode),
        DS.shadows.medium,
        { padding: DS.spacing.lg },
      ]}
    >
      {children}
    </View>
  ),

  Button: ({
    label,
    onPress,
    mode = "light",
  }: {
    label: string;
    onPress?: () => void;
    mode?: Mode;
  }) => (
    <Pressable onPress={onPress} style={({ pressed }) => motion.pressable({ pressed })}>
      <View
        style={[
          glass.panel(mode),
          DS.shadows.subtle,
          {
            height: 48,
            paddingHorizontal: DS.spacing.lg,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text
          style={{
            fontFamily: DS.typography.font.medium,
            fontSize: DS.typography.size.md,
            color:
              mode === "light"
                ? theme.light.textPrimary
                : theme.dark.textPrimary,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  ),
};

/* ============================================================
   EXPORT
   ============================================================ */

const DesignSystem = {
  DS,
  theme,
  glass,
  recessed,
  motion,
  layout,
  Panel,
  Button,
  InputField,
  ListItem,
  NavBar,
  Toolbar,
  Alert,
  StatCard,
  TableRow,
  IconCard,
  Sheet,
  Toggle,
  RNFallback,
};

export default DesignSystem;
```