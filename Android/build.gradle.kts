// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}

val requiredProperties = listOf("required_value")

requiredProperties.forEach { property ->
    if (!project.hasProperty(property)) {
        throw GradleException("Required property '$property' is not defined in your gradle.properties file.")
    }
}
