using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Features;
using Umbraco.Cms.ModelsBuilder.Embedded.BackOffice;
using Umbraco.Extensions;

namespace Umbraco.Cms.ModelsBuilder.Embedded
{
    /// <summary>
    /// Used in conjunction with <see cref="UmbracoBuilderExtensions.DisableModelsBuilderControllers"/>
    /// </summary>
    internal class DisableModelsBuilderNotificationHandler : INotificationHandler<UmbracoApplicationStarting>
    {
        private readonly UmbracoFeatures _features;

        public DisableModelsBuilderNotificationHandler(UmbracoFeatures features) => _features = features;

        /// <summary>
        /// Handles the <see cref="UmbracoApplicationStarting"/> notification to disable MB controller features
        /// </summary>
        public void Handle(UmbracoApplicationStarting notification)
        {
            // disable the embedded dashboard controller
            _features.Disabled.Controllers.Add<ModelsBuilderDashboardController>();
        }
    }
}